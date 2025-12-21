
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../App';
import { Post, Project, Talk, MediaItem, BadgeItem, Photo, ToolSection } from '../types';
import { marked } from 'marked';
import { supabase } from '../services/supabase';
import { DataService } from '../services/dataService';
import { 
  INITIAL_HOME_DATA, 
  INITIAL_POSTS, 
  INITIAL_PROJECTS, 
  INITIAL_TALKS, 
  INITIAL_MEDIA, 
  INITIAL_PHOTOS, 
  INITIAL_USE_SECTIONS 
} from '../data';

// Helper to generate valid UUIDs for Supabase compatibility
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Admin: React.FC = () => {
  const { 
    homeData, setHomeData, 
    posts, setPosts, 
    projects, setProjects, 
    talks, setTalks, 
    media, setMedia,
    photos, setPhotos,
    useSections, setUseSections,
    logout, saveData, refreshData
  } = useData();

  const [activeTab, setActiveTab] = useState<'home' | 'posts' | 'projects' | 'talks' | 'media' | 'photos' | 'use'>('home');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editingPost = useMemo(() => 
    posts.find(p => p.id === editingPostId), 
    [posts, editingPostId]
  );

  // Sync preview whenever content changes or mode switches to preview
  useEffect(() => {
    let isMounted = true;
    if (editingPost && editorMode === 'preview') {
      const render = async () => {
        try {
          const html = await marked.parse(editingPost.content || '');
          if (isMounted) setPreviewHtml(html);
        } catch (e) {
          if (isMounted) setPreviewHtml('<p class="text-red-500">Error rendering markdown.</p>');
        }
      };
      render();
    }
    return () => { isMounted = false; };
  }, [editingPost?.content, editorMode]);

  const handleDelete = async (table: string, id: string, list: any[], setter: Function) => {
    if (confirm('Are you sure you want to delete this?')) {
      setIsSaving(true);
      try {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
        setter(list.filter((i: any) => i.id !== id));
        DataService.invalidateCache();
      } catch (e: any) {
        alert(e.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const seedDatabase = async () => {
    if (!confirm("This will overwrite/reset database content with the default template. Continue?")) return;
    setIsSaving(true);
    try {
      // Clear existing site config first
      await supabase.from('site_config').delete().neq('id', '0');

      await saveData('site_config', {
        id: '00000000-0000-0000-0000-000000000000',
        name: INITIAL_HOME_DATA.name,
        bio_title: INITIAL_HOME_DATA.bioTitle,
        affiliations: INITIAL_HOME_DATA.affiliations,
        core_team: INITIAL_HOME_DATA.coreTeam,
        maintaining: INITIAL_HOME_DATA.maintaining,
        created_projects: INITIAL_HOME_DATA.createdProjects
      });

      // Use valid UUIDs for seeded data to avoid 400 errors
      const prepare = (item: any) => ({ ...item, id: generateUUID() });

      await Promise.all([
        ...INITIAL_POSTS.map(post => saveData('posts', { ...post, id: generateUUID() })),
        ...INITIAL_PROJECTS.map(project => saveData('projects', { ...project, id: generateUUID() })),
        ...INITIAL_TALKS.map(talk => saveData('talks', { ...talk, id: generateUUID() })),
        ...INITIAL_MEDIA.map(m => saveData('media', { ...m, id: generateUUID() })),
        ...INITIAL_PHOTOS.map(p => saveData('photos', { ...p, id: generateUUID() })),
        ...INITIAL_USE_SECTIONS.map(section => saveData('tool_sections', { ...section, id: generateUUID() }))
      ]);

      DataService.invalidateCache();
      alert("Database seeded successfully!");
      await refreshData();
    } catch (e: any) {
      console.error(e);
      alert(`Error seeding database: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePostState = (id: string, updates: Partial<Post>) => {
    setPosts(posts.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const saveHomeConfig = async () => {
    setIsSaving(true);
    try {
      await saveData('site_config', {
        id: '00000000-0000-0000-0000-000000000000',
        name: homeData.name,
        bio_title: homeData.bioTitle,
        affiliations: homeData.affiliations,
        core_team: homeData.coreTeam,
        maintaining: homeData.maintaining,
        created_projects: homeData.createdProjects
      });
      alert('Home config saved!');
    } finally {
      setIsSaving(false);
    }
  };

  const saveCurrentPost = async () => {
    if (!editingPost) return;
    setIsSaving(true);
    try {
      // Ensure the ID is a valid UUID before upserting
      const postToSave = { ...editingPost };
      // Simple check to see if it looks like a UUID, if not, we likely need to generate one
      // though usually new posts will have it from the start.
      await saveData('posts', postToSave);
      alert('Post saved!');
    } catch (e: any) {
      alert(`Error saving post: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const ItemCard = ({ title, subtitle, onEdit, onDelete }: any) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-xs opacity-50 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        {onEdit && <button onClick={onEdit} className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-md">Edit</button>}
        <button onClick={onDelete} disabled={isSaving} className="text-red-400 p-2 hover:scale-110 transition-transform disabled:opacity-30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2}/></svg>
        </button>
      </div>
    </div>
  );

  const BadgeEditor = ({ title, items, onUpdate }: { title: string, items: BadgeItem[], onUpdate: (items: BadgeItem[]) => void }) => {
    const [newItem, setNewItem] = useState({ label: '', href: '' });
    return (
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
        <h3 className="text-[10px] font-bold opacity-40 mb-4 uppercase tracking-widest">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 px-3 py-1 rounded-md text-xs flex items-center gap-2 border border-gray-100 dark:border-gray-700">
              <span>{item.label}</span>
              <button onClick={() => onUpdate(items.filter(i => i.id !== item.id))} className="text-red-400 font-bold hover:scale-125">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input placeholder="Label" className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded px-3 py-1.5 text-xs flex-1" value={newItem.label} onChange={e => setNewItem({...newItem, label: e.target.value})} />
          <input placeholder="Link" className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded px-3 py-1.5 text-xs flex-1" value={newItem.href} onChange={e => setNewItem({...newItem, href: e.target.value})} />
          <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded text-xs font-bold" onClick={() => { if (newItem.label) { onUpdate([...items, { ...newItem, id: generateUUID() }]); setNewItem({ label: '', href: '' }); } }}>Add</button>
        </div>
      </div>
    );
  };

  if (editingPostId && editingPost) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-black p-6 md:p-12 overflow-y-auto animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
            <button onClick={() => setEditingPostId(null)} className="text-sm opacity-50 hover:opacity-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={2}/></svg>
              Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <button onClick={saveCurrentPost} disabled={isSaving} className="bg-black dark:bg-white text-white dark:text-black px-6 py-1.5 rounded-lg text-sm font-bold">{isSaving ? 'Saving...' : 'Save Draft'}</button>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button onClick={() => setEditorMode('write')} className={`px-4 py-1 text-sm rounded-md transition-all ${editorMode === 'write' ? 'bg-white dark:bg-gray-700 shadow-sm opacity-100' : 'opacity-40'}`}>Write</button>
                <button onClick={() => setEditorMode('preview')} className={`px-4 py-1 text-sm rounded-md transition-all ${editorMode === 'preview' ? 'bg-white dark:bg-gray-700 shadow-sm opacity-100' : 'opacity-40'}`}>Preview</button>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input className="text-3xl font-bold bg-transparent w-full focus:outline-none" value={editingPost.title} onChange={e => updatePostState(editingPost.id, { title: e.target.value })} placeholder="Post Title" />
              <div className="flex gap-4">
                <input className="bg-transparent text-sm opacity-50 focus:outline-none border-b border-transparent focus:border-gray-200" value={editingPost.date} onChange={e => updatePostState(editingPost.id, { date: e.target.value })} placeholder="Date" />
                <input className="bg-transparent text-sm opacity-50 focus:outline-none border-b border-transparent focus:border-gray-200" value={editingPost.duration} onChange={e => updatePostState(editingPost.id, { duration: e.target.value })} placeholder="Read duration" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase opacity-30 font-bold tracking-widest">Categories (comma separated)</label>
              <input className="w-full bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg text-sm" value={editingPost.categories?.join(', ') || ''} onChange={e => updatePostState(editingPost.id, { categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
            </div>
          </div>
          <div className="min-h-[600px] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/30 dark:bg-gray-900/10">
            {editorMode === 'write' ? (
              <textarea className="w-full h-full min-h-[600px] bg-transparent p-6 font-mono text-sm leading-relaxed focus:outline-none resize-none" placeholder="Write in Markdown..." value={editingPost.content || ''} onChange={e => updatePostState(editingPost.id, { content: e.target.value })} />
            ) : (
              <div className="p-6 prose dark:prose-invert max-w-none min-h-[600px] bg-white dark:bg-black/20" dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="opacity-30 italic">Nothing to preview...</p>' }} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <header className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="opacity-50 text-sm">Synchronized with Supabase Cloud</p>
        </div>
        <div className="flex items-center gap-4">
           {isSaving && <span className="text-xs opacity-50 animate-pulse">Syncing...</span>}
           <button onClick={logout} className="text-sm opacity-50 hover:opacity-100 bg-red-500/10 text-red-500 px-3 py-1 rounded-md">Logout</button>
        </div>
      </header>

      <nav className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {(['home', 'posts', 'projects', 'talks', 'media', 'photos', 'use'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize pb-3 px-1 text-sm transition-all border-b-2 ${activeTab === tab ? 'border-black dark:border-white opacity-100 font-bold' : 'border-transparent opacity-40 hover:opacity-100'}`}
          >
            {tab === 'use' ? 'Tools' : tab}
          </button>
        ))}
      </nav>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <button onClick={seedDatabase} className="text-xs opacity-30 hover:opacity-100">Reset to Defaults</button>
              <button onClick={saveHomeConfig} disabled={isSaving} className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-lg text-sm font-bold">Save Changes</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase opacity-40 font-bold">Site Display Name</label>
                <input value={homeData.name} onChange={e => setHomeData({...homeData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg px-4 py-2" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase opacity-40 font-bold">Bio Intro Text</label>
                <textarea value={homeData.bioTitle} onChange={e => setHomeData({...homeData, bioTitle: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg px-4 py-2 h-24" />
              </div>
            </div>
            <BadgeEditor title="Affiliations" items={homeData.affiliations} onUpdate={items => setHomeData({...homeData, affiliations: items})} />
            <BadgeEditor title="Core Team" items={homeData.coreTeam} onUpdate={items => setHomeData({...homeData, coreTeam: items})} />
            <BadgeEditor title="Maintaining" items={homeData.maintaining} onUpdate={items => setHomeData({...homeData, maintaining: items})} />
            <BadgeEditor title="Home Badge Collection" items={homeData.createdProjects} onUpdate={items => setHomeData({...homeData, createdProjects: items})} />
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            <button onClick={() => { const newId = generateUUID(); const newPost = { id: newId, title: 'Untitled Post', date: new Date().toDateString(), duration: '5 min', categories: [], content: '' }; setPosts([newPost, ...posts]); setEditingPostId(newId); }} className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl opacity-50 hover:opacity-100 transition-all font-medium">+ Write New Post</button>
            <div className="space-y-3">
              {posts.map(post => (
                <ItemCard key={post.id} title={post.title} subtitle={`${post.date} • ${post.duration}`} onEdit={() => setEditingPostId(post.id)} onDelete={() => handleDelete('posts', post.id, posts, setPosts)} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <button onClick={() => { const newProj = { id: generateUUID(), name: 'New Project', description: '', link: '', github: '' }; setProjects([newProj, ...projects]); }} className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl opacity-50 hover:opacity-100 transition-all font-medium">+ Add Project</button>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4 relative group">
                  <div className="grid grid-cols-2 gap-4">
                    <input value={proj.name} onChange={e => setProjects(projects.map(p => p.id === proj.id ? {...p, name: e.target.value} : p))} className="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-black dark:focus:border-white font-bold" placeholder="Project Name" />
                    <input value={proj.github} onChange={e => setProjects(projects.map(p => p.id === proj.id ? {...p, github: e.target.value} : p))} className="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-black dark:focus:border-white text-sm opacity-50" placeholder="GitHub user/repo" />
                  </div>
                  <textarea value={proj.description} onChange={e => setProjects(projects.map(p => p.id === proj.id ? {...p, description: e.target.value} : p))} className="w-full bg-transparent text-sm focus:outline-none border border-transparent focus:border-gray-200 p-2 rounded-md" placeholder="Project description..." />
                  <div className="flex justify-between items-center">
                    <input value={proj.link} onChange={e => setProjects(projects.map(p => p.id === proj.id ? {...p, link: e.target.value} : p))} className="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-xs w-1/2" placeholder="Website Link" />
                    <div className="flex gap-2">
                      <button onClick={async () => { setIsSaving(true); await saveData('projects', proj); setIsSaving(false); alert('Project saved!'); }} className="bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded text-xs">Save</button>
                      <button onClick={() => handleDelete('projects', proj.id, projects, setProjects)} className="text-red-400 p-1">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'talks' && (
          <div className="space-y-6">
            <button onClick={() => { const newTalk = { id: generateUUID(), title: 'New Talk', event: '', date: '', link: '', location: '' }; setTalks([newTalk, ...talks]); }} className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl opacity-50 hover:opacity-100 transition-all font-medium">+ Add Talk Entry</button>
            <div className="space-y-4">
              {talks.map(talk => (
                <div key={talk.id} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={talk.title} onChange={e => setTalks(talks.map(t => t.id === talk.id ? {...t, title: e.target.value} : t))} className="bg-transparent font-medium" placeholder="Talk Title" />
                  <input value={talk.event} onChange={e => setTalks(talks.map(t => t.id === talk.id ? {...t, event: e.target.value} : t))} className="bg-transparent opacity-50" placeholder="Event Name" />
                  <input value={talk.date} onChange={e => setTalks(talks.map(t => t.id === talk.id ? {...t, date: e.target.value} : t))} className="bg-transparent text-sm" placeholder="Date (e.g. Oct 2024)" />
                  <div className="flex gap-2 items-center justify-end">
                    <button onClick={async () => { await saveData('talks', talk); alert('Talk saved!'); }} className="bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded text-xs">Save</button>
                    <button onClick={() => handleDelete('talks', talk.id, talks, setTalks)} className="text-red-400 p-1">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            <button onClick={() => { setMedia([{ id: generateUUID(), title: 'New Media', link: '', type: 'video' }, ...media]); }} className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl opacity-50 hover:opacity-100 transition-all font-medium">+ Add Media Appearance</button>
            <div className="space-y-3">
              {media.map(m => (
                <div key={m.id} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center">
                  <select value={m.type} onChange={e => setMedia(media.map(item => item.id === m.id ? {...item, type: e.target.value as any} : item))} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded px-2 py-1 text-sm capitalize">
                    {['video', 'podcast', 'article'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input value={m.title} onChange={e => setMedia(media.map(item => item.id === m.id ? {...item, title: e.target.value} : item))} className="bg-transparent flex-1 font-medium" placeholder="Title" />
                  <input value={m.link} onChange={e => setMedia(media.map(item => item.id === m.id ? {...item, link: e.target.value} : item))} className="bg-transparent opacity-50 text-xs flex-1" placeholder="URL" />
                  <div className="flex gap-2">
                    <button onClick={async () => { await saveData('media', m); alert('Saved!'); }} className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded">Save</button>
                    <button onClick={() => handleDelete('media', m.id, media, setMedia)} className="text-red-400">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            <button onClick={() => { setPhotos([{ id: generateUUID(), url: '', caption: '' }, ...photos]); }} className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl opacity-50 hover:opacity-100 transition-all font-medium">+ Add Photo</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photos.map(p => (
                <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                  {p.url && <img src={p.url} className="w-full h-32 object-cover rounded-lg" />}
                  <input value={p.url} onChange={e => setPhotos(photos.map(item => item.id === p.id ? {...item, url: e.target.value} : item))} className="w-full bg-transparent text-xs border-b border-gray-200 dark:border-gray-700" placeholder="Image URL" />
                  <input value={p.caption} onChange={e => setPhotos(photos.map(item => item.id === p.id ? {...item, caption: e.target.value} : item))} className="w-full bg-transparent text-sm" placeholder="Caption" />
                  <div className="flex justify-end gap-2">
                    <button onClick={async () => { await saveData('photos', p); alert('Saved!'); }} className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded">Save</button>
                    <button onClick={() => handleDelete('photos', p.id, photos, setPhotos)} className="text-red-400">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'use' && (
          <div className="space-y-6">
            <button onClick={() => { setUseSections([...useSections, { id: generateUUID(), title: 'New Section', items: [] }]); }} className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl opacity-50 hover:opacity-100 transition-all font-medium">+ Add Gear Category</button>
            <div className="space-y-6">
              {useSections.map(s => (
                <div key={s.id} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <input value={s.title} onChange={e => setUseSections(useSections.map(item => item.id === s.id ? {...item, title: e.target.value} : item))} className="bg-transparent text-lg font-bold" />
                    <div className="flex gap-2">
                      <button onClick={async () => { await saveData('tool_sections', s); alert('Saved!'); }} className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded">Save Section</button>
                      <button onClick={() => handleDelete('tool_sections', s.id, useSections, setUseSections)} className="text-red-400">Delete</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase opacity-40 font-bold">Items (One per line)</label>
                    <textarea 
                      value={s.items.join('\n')} 
                      onChange={e => setUseSections(useSections.map(item => item.id === s.id ? {...item, items: e.target.value.split('\n').filter(i => i.trim() !== '')} : item))}
                      className="w-full h-32 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-800 p-3 rounded-lg text-sm"
                      placeholder="MacBook Pro 14..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

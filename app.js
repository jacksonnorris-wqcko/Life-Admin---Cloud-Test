const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const APP_VERSION="10.0";
const APP_CHANNEL="Alpha";
const STORE="lifeAdminV2";
const ATTENTION_DAYS=0;
const SOON_DAYS=14;
const DOC_DB="lifeAdminDocumentsV1";
const DOC_CATEGORIES={all:"All",bills:"Bills",receipts:"Receipts",insurance:"Insurance",warranties:"Warranties",personal:"Personal",other:"Other"};
let docDBPromise=null;
let docView={category:"all"};
let pendingDocFiles=[];
const cats={home:{name:"Home",icon:"home"},car:{name:"Car",icon:"car"},money:{name:"Money",icon:"money"},personal:{name:"Personal",icon:"personal"},family:{name:"Family",icon:"family"},other:{name:"Other",icon:"other"},income:{name:"Income",icon:"income"}};
const icons={
home:`<svg viewBox="0 0 24 24"><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/></svg>`,
car:`<svg viewBox="0 0 24 24"><path d="M5 17.5h14l-1-7H6l-1 7Z"/><path d="m7 10.5 1.5-4h7l1.5 4"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/></svg>`,
money:`<svg viewBox="0 0 24 24"><path d="M4 7.5h16v11H4z"/><path d="M7 7.5V5h13v10h-3"/><circle cx="12" cy="13" r="2.5"/></svg>`,
personal:`<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="8.5" cy="11" r="2"/><path d="M6 15c.8-1.4 4.2-1.4 5 0M14 10h4M14 13h4"/></svg>`,
family:`<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="2.5"/><circle cx="16" cy="8" r="2"/><path d="M4.5 18c.8-3.5 8.2-3.5 9 0M13 17c.5-2.8 6-2.8 6.5 0"/></svg>`,
other:`<svg viewBox="0 0 24 24"><path d="M4 7h6l1.5 2H20v10H4z"/><path d="M4 7V5h6l1.5 2"/></svg>`,
settings:`<svg viewBox="0 0 24 24"><path d="M9.8 3.8h4.4l.6 2a7.7 7.7 0 0 1 1.6.9l2-.6 2.2 3.8-1.5 1.5a7.6 7.6 0 0 1 0 1.9l1.5 1.5-2.2 3.8-2-.6a7.7 7.7 0 0 1-1.6.9l-.6 2H9.8l-.6-2a7.7 7.7 0 0 1-1.6-.9l-2 .6-2.2-3.8L5 13.1a7.6 7.6 0 0 1 0-1.9L3.5 9.7l2.2-3.8 2 .6a7.7 7.7 0 0 1 1.6-.9z"/><circle cx="12" cy="12.1" r="2.6"/></svg>`,
calendar:`<svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="15" rx="2"/><path d="M8 3.5v4M16 3.5v4M4 9.5h16"/></svg>`,
repeat:`<svg viewBox="0 0 24 24"><path d="M18.5 7.5A7 7 0 0 0 6 6l-2 2M4 5v3h3"/><path d="M5.5 16.5A7 7 0 0 0 18 18l2-2M20 19v-3h-3"/></svg>`,
warning:`<svg viewBox="0 0 24 24"><path d="m12 4 9 16H3z"/><path d="M12 9v5M12 17.5v.2"/></svg>`,
check:`<svg viewBox="0 0 24 24"><path d="m5 12 4.2 4.2L19 6.5"/></svg>`,
search:`<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.2"/><path d="m16 16 4.5 4.5"/></svg>`,
close:`<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
add:`<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
grid:`<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>`,
items:`<svg viewBox="0 0 24 24"><rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>`,
chart:`<svg viewBox="0 0 24 24"><path d="M5 20V11M12 20V5M19 20v-8"/></svg>`,
income:`<svg viewBox="0 0 24 24"><path d="M12 20V4M7 9l5-5 5 5"/><path d="M5 20h14"/></svg>`,
paperclip:`<svg viewBox="0 0 24 24"><path d="m8 12.5 6.8-6.8a3.2 3.2 0 0 1 4.5 4.5L10 19.5a4.5 4.5 0 0 1-6.4-6.4l9-9"/></svg>`,
edit:`<svg viewBox="0 0 24 24"><path d="m5 19 1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L9 18z"/><path d="m14.5 6.5 3 3"/></svg>`,
trash:`<svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></svg>`,
pin:`<svg viewBox="0 0 24 24"><path d="m8 4 8 8M10 6l8 8M7 9l8 8M6 4l14 14M10 14 5 19"/></svg>`,
clock:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>`,
plusCircle:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/></svg>`
};
const THEMES={forest:{name:"Forest",meta:"Current Life Admin",color:"#176b4d"},ocean:{name:"Ocean",meta:"Cool and calm",color:"#176a8a"},slate:{name:"Slate",meta:"Clean and modern",color:"#40566f"},sunset:{name:"Sunset",meta:"Warm and friendly",color:"#a64b2a"},lavender:{name:"Lavender",meta:"Soft and personal",color:"#6c4aa1"}};
function applyTheme(theme){const key=THEMES[theme]?theme:"forest";document.documentElement.dataset.theme=key;const meta=document.querySelector('meta[name="theme-color"]');if(meta){const colors={forest:"#176b4d",ocean:"#176a8a",slate:"#40566f",sunset:"#a64b2a",lavender:"#6c4aa1"};meta.setAttribute("content",colors[key])}}
let state=loadState();
let view={category:"all",filter:"attention",search:"",agenda:"today"};
let calendarView={month:startOfMonth(today()),selected:dateKey(today())};
function loadState(){try{const s=JSON.parse(localStorage.getItem(STORE));if(s&&Array.isArray(s.items)){s.settings={notifications:false,theme:"forest",...(s.settings||{})};s.items=s.items.map(i=>({...i,moneyType:i.moneyType||"expense",attachments:i.attachments||[],completed:!!i.completed,pinned:!!i.pinned,priority:i.priority||"normal",seriesId:i.seriesId||null}));s.events=Array.isArray(s.events)?s.events:[];s.documents=Array.isArray(s.documents)?s.documents:[];return s}}catch{}return{name:"",items:[],events:[],documents:[],settings:{notifications:false,theme:"forest"}}}
function save(){localStorage.setItem(STORE,JSON.stringify(state));render()}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function today(){const d=new Date();d.setHours(0,0,0,0);return d}
function dateObj(s){return new Date(`${s}T00:00:00`)}
function iso(d){return d.toISOString().slice(0,10)}
function daysUntil(s){return Math.ceil((dateObj(s)-today())/86400000)}
function formatDate(s){return dateObj(s).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}
function money(v){return "$"+Number(v||0).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2})}
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(16).slice(2)}
function iconFor(cat){return icons[cats[cat]?.icon||"other"]}
function installIcons(){$$('[data-icon]').forEach(el=>{const k=el.dataset.icon;if(icons[k])el.innerHTML=icons[k]})}
function addMonths(d,n){const x=new Date(d);const day=x.getDate();x.setDate(1);x.setMonth(x.getMonth()+n);const last=new Date(x.getFullYear(),x.getMonth()+1,0).getDate();x.setDate(Math.min(day,last));return x}
function addYears(d,n){const x=new Date(d);x.setFullYear(x.getFullYear()+n);return x}
function nextDue(item){let d=dateObj(item.due),now=today();if(!item.repeat||item.repeat==="Doesn't repeat")return null;while(d<=now){if(item.repeat==="Weekly")d.setDate(d.getDate()+7);else if(item.repeat==="Fortnightly")d.setDate(d.getDate()+14);else if(item.repeat==="Monthly")d=addMonths(d,1);else if(item.repeat==="Every 3 months")d=addMonths(d,3);else if(item.repeat==="Every 6 months")d=addMonths(d,6);else if(item.repeat==="Yearly")d=addYears(d,1);else break}return iso(d)}
function normalizeIncomingItems(){
  let changed=false;
  const todayKey=iso(today());
  const additions=[];
  state.items.forEach(i=>{
    if(i.completed||i.moneyType!=="income"||!i.due)return;
    if(i.due>todayKey)return;
    i.completed=true;
    i.completedAt=i.due;
    changed=true;
    const next=nextDue(i);
    if(next){
      const exists=state.items.some(x=>x.id!==i.id&&x.seriesId===i.seriesId&&x.moneyType==="income"&&!x.completed&&x.due===next);
      if(!exists)additions.push({...i,id:uid(),due:next,completed:false,completedAt:null,attachments:[],seriesId:i.seriesId||uid()});
    }
  });
  if(additions.length){state.items.push(...additions);changed=true}
  return changed;
}
function updateGreeting(){const el=$("#pageTitle");if(!el)return;const h=new Date().getHours();el.firstChild.nodeValue=h<12?"Good morning":"Good afternoon"}
function status(i){if(i.completed)return"complete";const d=daysUntil(i.due);if(i.moneyType==="income"&&d<=0)return"complete";return d<0?"overdue":d<=SOON_DAYS?"soon":""}
function filteredItems(){
  let arr=state.items.filter(i=>view.category==="all"||i.category===view.category);
  const q=view.search.trim().toLowerCase();
  if(q)arr=arr.filter(i=>[i.title,i.notes,i.provider,i.category].join(" ").toLowerCase().includes(q));
  if(view.filter==="attention")arr=arr.filter(i=>!i.completed&&i.moneyType!=="income"&&(daysUntil(i.due)<0||daysUntil(i.due)<=ATTENTION_DAYS));
  if(view.filter==="overdue")arr=arr.filter(i=>!i.completed&&i.moneyType!=="income"&&daysUntil(i.due)<0);
  if(view.filter==="soon")arr=arr.filter(i=>!i.completed&&i.moneyType!=="income"&&daysUntil(i.due)>=0&&daysUntil(i.due)<=SOON_DAYS);
  if(view.filter==="completed")arr=arr.filter(i=>i.completed);
  if(view.filter==="cost")arr=arr.filter(i=>!i.completed&&i.moneyType!=="income"&&Number(i.cost)>0&&daysUntil(i.due)>=0&&daysUntil(i.due)<=30);
  if(view.filter==="income")arr=arr.filter(i=>!i.completed&&i.moneyType==="income"&&Number(i.cost)>0);
  return arr.sort((a,b)=>{
    if(view.filter==="completed")return new Date(b.completedAt||b.due)-new Date(a.completedAt||a.due);
    if(view.filter==="attention"||view.filter==="overdue"||view.filter==="soon"){
      const pa=priorityRank(a.priority),pb=priorityRank(b.priority); if(pa!==pb)return pa-pb;
      return dateObj(a.due)-dateObj(b.due);
    }
    if(a.pinned!==b.pinned)return a.pinned?-1:1;
    if(priorityRank(a.priority)!==priorityRank(b.priority))return priorityRank(a.priority)-priorityRank(b.priority);
    if(a.completed!==b.completed)return a.completed?1:-1;
    return dateObj(a.due)-dateObj(b.due)
  })
}
function priorityLabel(p){return p==="urgent"?"Urgent":p==="high"?"Important":p==="low"?"Low":"Normal"}
function priorityRank(p){return p==="urgent"?0:p==="high"?1:p==="normal"?2:3}
function renderMoneyCentre(incoming,outgoing){const net=incoming-outgoing;$("#moneyCentreIn").textContent=money(incoming);$("#moneyCentreOut").textContent=money(outgoing);$("#moneyCentreNet").textContent=(net>=0?"+":"-")+money(Math.abs(net));$("#moneyCentreNet").className=net>=0?"positive":"negative";const max=Math.max(incoming+outgoing,1);$("#moneyMeterIn").style.width=(incoming/max*100)+"%";$("#moneyMeterOut").style.width=(outgoing/max*100)+"%"}
function openDocumentDB(){
  if(!("indexedDB" in window))return Promise.resolve(null);
  if(docDBPromise)return docDBPromise;
  docDBPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open(DOC_DB,1);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains("files"))db.createObjectStore("files",{keyPath:"id"})};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>{docDBPromise=null;reject(req.error)};
  });
  return docDBPromise;
}
function idbPutFile(id,blob){return openDocumentDB().then(db=>{if(!db)throw Error("Document storage unavailable");return new Promise((res,rej)=>{const tx=db.transaction("files","readwrite");tx.objectStore("files").put({id,blob});tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})})}
function idbGetFile(id){return openDocumentDB().then(db=>{if(!db)return null;return new Promise((res,rej)=>{const tx=db.transaction("files","readonly"),req=tx.objectStore("files").get(id);req.onsuccess=()=>res(req.result?.blob||null);req.onerror=()=>rej(req.error)})})}
function idbDeleteFile(id){return openDocumentDB().then(db=>{if(!db)return;return new Promise((res,rej)=>{const tx=db.transaction("files","readwrite");tx.objectStore("files").delete(id);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})})}
function idbClearFiles(){return openDocumentDB().then(db=>{if(!db)return;return new Promise((res,rej)=>{const tx=db.transaction("files","readwrite");tx.objectStore("files").clear();tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})})}
function allDocumentRecords(){
  const out=[];
  state.documents.forEach(d=>{
    const linked=state.items.find(i=>i.id===d.itemId);
    out.push({...d,itemTitle:linked?.title||null,source:"vault"});
  });
  state.items.forEach(i=>(i.attachments||[]).forEach((a,n)=>out.push({id:`attachment:${i.id}:${n}`,name:a.name,type:a.type||"",size:a.size||0,category:a.category||"other",itemId:i.id,itemTitle:i.title,source:"attachment",attachmentIndex:n,data:a.data||null,createdAt:a.createdAt||i.createdAt||new Date().toISOString()})));
  return out.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
}
function linkedDocuments(itemId){
  return state.documents.filter(d=>d.itemId===itemId).map(d=>({...d,itemTitle:state.items.find(i=>i.id===d.itemId)?.title||null}));
}
function docCategoryLabel(k){return DOC_CATEGORIES[k]||"Other"}
function docIcon(type=""){return type.startsWith("image/")?icons.personal:type==="application/pdf"?icons.items:icons.paperclip}
function renderDocuments(){
  const preview=$("#documentPreview");if(!preview)return;
  const files=allDocumentRecords();
  $("#documentsSummary").textContent=files.length?`${files.length} document${files.length===1?"":"s"} stored locally.`:"No documents stored yet.";
  preview.innerHTML=files.slice(0,4).map(f=>`<button type="button" class="document-row" data-doc-open="${esc(f.id)}"><span class="document-icon">${docIcon(f.type)}</span><span><b>${esc(f.name)}</b><small>${esc(f.itemTitle||docCategoryLabel(f.category))}</small></span><span class="document-arrow">›</span></button>`).join("")||`<div class="document-empty">Bills, receipts, warranties and photos can all live here.</div>`;
}
async function openDocuments(){
  const files=allDocumentRecords();
  const tabs=Object.entries(DOC_CATEGORIES).map(([k,v])=>`<button type="button" class="document-tab ${docView.category===k?"active":""}" data-doc-category="${k}">${v}</button>`).join("");
  openModal(`<div class="modal-header"><div><h3>Document Vault</h3><small class="muted">Bills, receipts, photos and important files</small></div><button type="button" class="close" id="close">${icons.close}</button></div><div class="document-toolbar"><button type="button" class="primary document-add" id="addDocument">${icons.add} Add documents</button></div><div class="document-tabs">${tabs}</div><div class="document-list" id="vaultList"></div>`);
  $("#close").onclick=closeModal;$("#addDocument").onclick=openDocumentUpload;renderVaultList();
}
function renderVaultList(){
  const el=$("#vaultList");if(!el)return;let files=allDocumentRecords();if(docView.category!=="all")files=files.filter(f=>(f.category||"other")===docView.category);
  if(!files.length){el.innerHTML=`<div class="document-empty"><strong>No ${docCategoryLabel(docView.category).toLowerCase()} yet.</strong><small>Add a photo, PDF or document and choose its category.</small></div>`;return}
  el.innerHTML=files.map(f=>`<div class="document-row vault-row"><button type="button" class="document-open" data-doc-open="${esc(f.id)}"><span class="document-icon">${docIcon(f.type)}</span><span><b>${esc(f.name)}</b><small>${esc(f.itemTitle||docCategoryLabel(f.category))} · ${f.size?formatBytes(f.size):"Stored locally"}</small></span></button><button type="button" class="document-more" aria-label="Document options" data-doc-delete="${esc(f.id)}">${icons.trash}</button></div>`).join("");
  $$("[data-doc-category]").forEach(b=>b.onclick=()=>{docView.category=b.dataset.docCategory;renderVaultList();$$('[data-doc-category]').forEach(x=>x.classList.toggle("active",x===b))});
}
function formatBytes(n){if(!n)return"0 KB";if(n<1024)return`${n} B`;if(n<1048576)return`${(n/1024).toFixed(0)} KB`;return`${(n/1048576).toFixed(1)} MB`}
function itemOptionsForDocs(){return `<option value="">No linked item</option>${state.items.slice().sort((a,b)=>a.title.localeCompare(b.title)).map(i=>`<option value="${i.id}">${esc(i.title)}</option>`).join("")}`}
function openDocumentUpload(prefillItemId=null){
  pendingDocFiles=[];
  openModal(`<div class="modal-header"><div><h3>Add documents</h3><small class="muted">Store photos, PDFs and receipts on this device</small></div><button type="button" class="close" id="close">${icons.close}</button></div><div class="document-drop" id="documentPick">${icons.paperclip}<strong>Choose photos or files</strong><small>You can select multiple files</small></div><div id="selectedDocs" class="selected-docs"><div class="document-empty">No files selected yet.</div></div><div class="form-grid"><div class="field"><label>Category</label><select id="documentCategory">${Object.entries(DOC_CATEGORIES).filter(([k])=>k!=="all").map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></div><div class="field"><label>Link to an item <span class="muted">(optional)</span></label><select id="documentItem">${itemOptionsForDocs()}</select></div></div><div class="form-actions"><button type="button" class="secondary" id="cancel">Cancel</button><button type="button" class="primary" id="saveDocuments">Save documents</button></div>`);
  $("#close").onclick=closeModal;$("#cancel").onclick=closeModal;$("#documentPick").onclick=()=>$("#documentInput").click();$("#documentInput").value="";$("#documentInput").accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv";
  if(prefillItemId)$("#documentItem").value=prefillItemId;
  $("#documentInput").onchange=()=>{pendingDocFiles=[...(document.querySelector("#documentInput").files||[])];renderSelectedDocs()};$("#saveDocuments").onclick=saveDocuments;
}
function renderSelectedDocs(){const el=$("#selectedDocs");if(!el)return;el.innerHTML=pendingDocFiles.length?pendingDocFiles.map(f=>`<div class="selected-doc"><span class="document-icon">${docIcon(f.type)}</span><span><b>${esc(f.name)}</b><small>${formatBytes(f.size)}</small></span></div>`).join(""):"<div class=\"document-empty\">No files selected yet.</div>"}
async function saveDocuments(){
  if(!pendingDocFiles.length){toast("Choose at least one file first");return}
  const category=$("#documentCategory").value,itemId=$("#documentItem").value||null,now=new Date().toISOString();
  try{
    for(const f of pendingDocFiles){const id=uid();await idbPutFile(id,f);state.documents.push({id,name:f.name,type:f.type||"application/octet-stream",size:f.size,category,itemId,createdAt:now});}
    save();pendingDocFiles=[];toast("Documents saved");await openDocuments();
  }catch(err){console.error(err);toast("Document storage is unavailable on this device")}
}
async function openDocumentRecord(id){
  const files=allDocumentRecords(),f=files.find(x=>x.id===id);if(!f)return;
  if(f.source==="attachment"){if(f.data){openDocumentViewer(f,f.data);return}openModal(`<div class="modal-header"><h3>${esc(f.name)}</h3><button type="button" class="close" id="close">${icons.close}</button></div><p class="muted">This older attachment has metadata stored, but no preview data.</p>`);$("#close").onclick=closeModal;return}
  const blob=await idbGetFile(f.id);if(!blob){toast("That document could not be opened");return}openDocumentViewer(f,URL.createObjectURL(blob));
}
function openDocumentViewer(f,src){const isImage=(f.type||"").startsWith("image/"),isPdf=f.type==="application/pdf";openModal(`<div class="modal-header"><div><h3>${esc(f.name)}</h3><small class="muted">${esc(docCategoryLabel(f.category))}${f.itemTitle?` · ${esc(f.itemTitle)}`:""}</small></div><button type="button" class="close" id="close">${icons.close}</button></div><div class="document-viewer">${isImage?`<img src="${src}" alt="${esc(f.name)}">`:isPdf?`<iframe src="${src}" title="${esc(f.name)}"></iframe>`:`<div class="document-file-icon">${docIcon(f.type)}<b>${esc(f.type||"Document")}</b><a class="primary" href="${src}" target="_blank" rel="noopener">Open file</a></div>`}</div><div class="form-actions">${f.source==="vault"&&f.itemId?`<button type="button" class="secondary" id="unlinkDoc">Unlink from ${esc(f.itemTitle||"item")}</button>`:""}<button type="button" class="danger-btn" id="deleteDoc">${icons.trash} Delete document</button><button type="button" class="secondary" id="close2">Close</button></div>`);$("#close").onclick=closeModal;$("#close2").onclick=closeModal;$("#deleteDoc").onclick=()=>deleteDocument(f.id);const u=$("#unlinkDoc");if(u)u.onclick=()=>unlinkDocument(f.id);}
function unlinkDocumentFromItem(id){const f=state.documents.find(x=>x.id===id);if(!f)return;const itemId=f.itemId;f.itemId=null;save();toast("Document unlinked");if(itemId)openDetail(itemId)}
function unlinkDocument(id){const f=state.documents.find(x=>x.id===id);if(!f)return;f.itemId=null;save();toast("Document unlinked");closeModal();}
function linkDocumentToItem(docId,itemId){const f=state.documents.find(x=>x.id===docId),i=state.items.find(x=>x.id===itemId);if(!f||!i)return;f.itemId=i.id;save();toast("Document linked to item");openDetail(i.id);}
function openDocumentPicker(itemId){
  let files=state.documents.filter(d=>d.itemId!==itemId);
  const tabs=Object.entries(DOC_CATEGORIES).map(([k,v])=>`<button type="button" class="document-tab ${k==="all"?"active":""}" data-link-category="${k}">${v}</button>`).join("");
  openModal(`<div class="modal-header"><div><h3>Link a document</h3><small class="muted">Choose a document already stored in your vault</small></div><button type="button" class="close" id="close">${icons.close}</button></div><div class="document-tabs">${tabs}</div><div class="document-list" id="linkDocumentList"></div><div class="form-actions"><button type="button" class="secondary" id="uploadAndLink">${icons.add} Add a new document</button><button type="button" class="secondary" id="cancel">Cancel</button></div>`);
  const render=()=>{const cat=document.querySelector('[data-link-category].active')?.dataset.linkCategory||"all";let list=files;if(cat!=="all")list=list.filter(d=>(d.category||"other")===cat);const el=$("#linkDocumentList");el.innerHTML=list.map(d=>`<button type="button" class="document-row link-document-row" data-link-doc="${esc(d.id)}"><span class="document-icon">${docIcon(d.type)}</span><span><b>${esc(d.name)}</b><small>${esc(docCategoryLabel(d.category))}${d.itemId?` · linked to ${esc(state.items.find(i=>i.id===d.itemId)?.title||"another item")}`:""}</small></span><span class="document-arrow">›</span></button>`).join("")||`<div class="document-empty"><strong>No available documents</strong><small>Upload one here and it will be linked automatically.</small></div>`;$$('[data-link-category]').forEach(b=>b.onclick=()=>{ $$('[data-link-category]').forEach(x=>x.classList.toggle('active',x===b));render()});$$('[data-link-doc]').forEach(b=>b.onclick=()=>linkDocumentToItem(b.dataset.linkDoc,itemId));};
  $("#close").onclick=closeModal;$("#cancel").onclick=closeModal;$("#uploadAndLink").onclick=()=>{closeModal();openDocumentUpload(itemId)};render();
}
async function deleteDocument(id){if(!confirm("Delete this document?"))return;const f=state.documents.find(x=>x.id===id);if(f){state.documents=state.documents.filter(x=>x.id!==id);await idbDeleteFile(id);save();toast("Document deleted");await openDocuments();return}const m=/^attachment:(.+):(\d+)$/.exec(id);if(m){const i=state.items.find(x=>x.id===m[1]);if(i){i.attachments.splice(Number(m[2]),1);save();toast("Attachment deleted");await openDocuments()}}}

function setupTabs(){switchTab("home")}
function switchTab(tab,filter=null){
  const target=tab;
  $$('[data-tab-panel]').forEach(el=>el.hidden=el.dataset.tabPanel!==target);
  $$('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===tab));
  const titles={home:"Good morning",items:"Your items",calendar:"Calendar",money:"Money centre",more:"More"};
  if($('#tabEyebrow'))$('#tabEyebrow').textContent=tab==="home"?"LIFE ADMIN":tab.toUpperCase();
  if($('#pageTitle'))$('#pageTitle').firstChild.textContent=titles[tab]||"Life Admin";
  if(tab==='home'){view.filter='attention';view.category='all';view.search='';if($('#searchInput'))$('#searchInput').value='';render();}
  if(tab==='items'){view.filter=filter||'all';view.category='all';view.search='';if($('#searchInput'))$('#searchInput').value='';render();}
  if(tab==='calendar'){view.filter='all';renderCalendar();}
  if(tab==='money'){view.filter='all';render();}
  if(tab==='more'){render();}
  window.scrollTo({top:0,behavior:'smooth'});
}
function initTabs(){if(document.body.dataset.tabsReady)return;document.body.dataset.tabsReady='1';setupTabs()}
function monthLabel(d){return d.toLocaleDateString(undefined,{month:"long",year:"numeric"})}
function startOfMonth(d){return new Date(d.getFullYear(),d.getMonth(),1)}
function endOfMonth(d){return new Date(d.getFullYear(),d.getMonth()+1,0)}
function dateKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function calendarItemsForMonth(month){
  const start=startOfMonth(month), end=endOfMonth(month), out=[];
  state.items.filter(i=>!i.completed).forEach(i=>{
    let d=dateObj(i.due); if(Number.isNaN(d.getTime()))return;
    if(!i.repeat||i.repeat==="Doesn't repeat") { if(d>=start&&d<=end) out.push({kind:"item",id:i.id,date:dateKey(d),title:i.title,time:"",moneyType:i.moneyType,cost:i.cost,category:i.category,icon:cats[i.category]?.icon||"other"}); return; }
    let guard=0; while(d<start&&guard++<1000){
      const n=nextOccurrenceDate(d,i.repeat); if(!n)break; d=n;
    }
    while(d<=end&&guard++<1000){if(d>=start)out.push({kind:"item",id:i.id,date:dateKey(d),title:i.title,time:"",moneyType:i.moneyType,cost:i.cost,category:i.category,icon:cats[i.category]?.icon||"other"}); const n=nextOccurrenceDate(d,i.repeat);if(!n)break;d=n;}
  });
  (state.events||[]).forEach(e=>{
    let d=dateObj(e.date); if(Number.isNaN(d.getTime()))return;
    const repeat=e.repeat||"Doesn't repeat";
    if(repeat==="Doesn't repeat"){
      if(d>=start&&d<=end)out.push({kind:"event",id:e.id,date:dateKey(d),title:e.title,time:e.time||"",eventType:e.type||"event",icon:e.type==="birthday"?"family":e.type==="appointment"?"calendar":"items"});
      return;
    }
    let guard=0;
    while(d<start&&guard++<1000){const n=nextOccurrenceDate(d,repeat);if(!n)break;d=n;}
    while(d<=end&&guard++<1000){
      if(d>=start)out.push({kind:"event",id:e.id,date:dateKey(d),title:e.title,time:e.time||"",eventType:e.type||"event",icon:e.type==="birthday"?"family":e.type==="appointment"?"calendar":"items"});
      const n=nextOccurrenceDate(d,repeat);if(!n)break;d=n;
    }
  });
  return out.sort((a,b)=>(a.date+b.time).localeCompare(b.date+a.time));
}
function nextOccurrenceDate(d,repeat){const x=new Date(d);if(repeat==="Weekly")x.setDate(x.getDate()+7);else if(repeat==="Fortnightly")x.setDate(x.getDate()+14);else if(repeat==="Monthly")return addMonths(x,1);else if(repeat==="Every 3 months")return addMonths(x,3);else if(repeat==="Every 6 months")return addMonths(x,6);else if(repeat==="Yearly")return addYears(x,1);else return null;return x}
function calendarEventsForDay(key){const month=calendarView.month;return calendarItemsForMonth(month).filter(x=>x.date===key)}
function renderCalendar(){
  const m=calendarView.month; if(!m)return; const events=calendarItemsForMonth(m); const grid=$("#calendarGrid"); if(!grid)return;
  $("#calendarMonthTitle").textContent=monthLabel(m);
  const first=startOfMonth(m), offset=(first.getDay()+6)%7, days=endOfMonth(m).getDate(), prevDays=new Date(m.getFullYear(),m.getMonth(),0).getDate(); let html="";
  for(let i=0;i<42;i++){const dayNum=i-offset+1;let d=new Date(m.getFullYear(),m.getMonth(),dayNum);let outside=d.getMonth()!==m.getMonth();if(i>=days+offset&&i>=35)break;const key=dateKey(d), list=events.filter(x=>x.date===key), isToday=key===dateKey(today()), isSelected=key===calendarView.selected;html+=`<button type="button" class="cal-day ${outside?"outside":""} ${isToday?"today":""} ${isSelected?"selected":""}" data-cal-date="${key}"><span class="cal-number">${d.getDate()}</span><span class="cal-dots">${list.slice(0,3).map(x=>`<i class="cal-dot ${x.kind==="item"?(x.moneyType==="income"?"income":"bill"):x.eventType}"></i>`).join("")}</span></button>`;}
  grid.innerHTML=html;
  renderCalendarDay();
}
function renderCalendarDay(){const key=calendarView.selected||dateKey(today()), d=dateObj(key), list=calendarEventsForDay(key), title=$("#calendarSelectedTitle"), el=$("#calendarDayList");if(!title||!el)return;title.textContent=key===dateKey(today())?"Today":d.toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"});el.innerHTML=list.length?list.map(x=>{const amount=x.cost?`<span class="calendar-event-amount ${x.moneyType==="income"?"income-text":""}">${x.moneyType==="income"?"+":"-"}${money(x.cost)}</span>`:"";return `<button type="button" class="calendar-event-row" ${x.kind==="item"?`data-open="${x.id}"`:`data-calendar-event="${x.id}"`}><span class="calendar-event-icon ${x.kind==="item"?(x.moneyType==="income"?"income":"bill"):x.eventType}">${icons[x.icon]||icons.calendar}</span><span class="calendar-event-main"><b>${esc(x.title)}</b><small>${x.time|| (x.kind==="item"?(x.moneyType==="income"?"Income scheduled":"Bill / admin item"):x.eventType)}</small></span>${amount}<span class="calendar-arrow">›</span></button>`}).join(""):"<div class=\"empty\">Nothing scheduled for this day.</div>"}
function eventFormHtml(e={}){const isEdit=!!e.id;return `<div class="modal-header"><h3>${isEdit?"Edit event":"Add calendar event"}</h3><button type="button" class="close" id="close">${icons.close}</button></div><form id="calendarForm"><div class="field"><label>Type</label><select id="eventType"><option value="event" ${e.type==="event"||!e.type?"selected":""}>General event</option><option value="birthday" ${e.type==="birthday"?"selected":""}>Birthday</option><option value="appointment" ${e.type==="appointment"?"selected":""}>Appointment</option></select></div><div class="field"><label>Title</label><input id="eventTitle" maxlength="100" required value="${esc(e.title||"")}" placeholder="e.g. Mum's birthday"></div><div class="form-row"><div class="field"><label>Date</label><input id="eventDate" type="date" required value="${e.date||dateKey(calendarView.selected?dateObj(calendarView.selected):today())}"></div><div class="field"><label>Time <span class="muted">(optional)</span></label><input id="eventTime" type="time" value="${esc(e.time||"")}"></div></div><div class="field"><label>Repeat</label><select id="eventRepeat">${repeatOptions(e.repeat||"Doesn't repeat")}</select></div><div class="field"><label>Notes <span class="muted">(optional)</span></label><textarea id="eventNotes" maxlength="500">${esc(e.notes||"")}</textarea></div><div class="form-actions">${isEdit?`<button type="button" class="danger-btn" id="deleteEvent">${icons.trash} Delete</button>`:""}<button type="button" class="secondary" id="cancel">Cancel</button><button type="submit" class="primary">Save event</button></div></form>`}
function openCalendarEvent(id){const e=(state.events||[]).find(x=>x.id===id);if(!e)return;openModal(eventFormHtml(e));bindCalendarForm(e)}
function openCalendarAdd(){openModal(eventFormHtml({date:calendarView.selected||dateKey(today())}));bindCalendarForm()}
function bindCalendarForm(existing){$("#close").onclick=closeModal;$("#cancel").onclick=closeModal;$("#calendarForm").onsubmit=ev=>{ev.preventDefault();const data={title:$("#eventTitle").value.trim(),type:$("#eventType").value,date:$("#eventDate").value,time:$("#eventTime").value,repeat:$("#eventRepeat").value,notes:$("#eventNotes").value.trim()};if(!data.title||!data.date)return;if(existing)Object.assign(existing,data);else{state.events=state.events||[];state.events.push({id:uid(),...data,createdAt:new Date().toISOString()})}calendarView.month=dateObj(data.date);calendarView.selected=data.date;closeModal();save();toast(existing?"Event updated":"Event added");renderCalendar()};if(existing)$("#deleteEvent").onclick=()=>{if(confirm("Delete this calendar event?")){state.events=state.events.filter(x=>x.id!==existing.id);closeModal();save();renderCalendar();toast("Event deleted")}}}
function render(){
  const incomingChanged=normalizeIncomingItems();
  if(incomingChanged)localStorage.setItem(STORE,JSON.stringify(state));
  const activeTab=document.querySelector(".nav-item.active")?.dataset.tab||"home";
  $("#userName").textContent=activeTab==="home"&&state.name?", "+esc(state.name):"";
  updateGreeting();
  const active=state.items.filter(i=>!i.completed&&i.moneyType!=="income");
  const activeMoney=state.items.filter(i=>!i.completed);
  const overdue=active.filter(i=>daysUntil(i.due)<0);
  const soon=active.filter(i=>daysUntil(i.due)>=0&&daysUntil(i.due)<=SOON_DAYS);
  const completed=state.items.filter(i=>i.completed);
  const start=today(), end30=new Date(start); end30.setDate(end30.getDate()+30);
  const end365=new Date(start); end365.setDate(end365.getDate()+365);
  const outgoing30=projectedSum(activeMoney,start,end30,"expense");
  const outgoing365=projectedSum(activeMoney,start,end365,"expense");
  const incoming30=projectedSum(activeMoney,start,end30,"income");
  const incoming365=projectedSum(activeMoney,start,end365,"income");
  const annualisedIncome=annualisedRecurring(activeMoney,"income");
  const annualisedOutgoing=annualisedRecurring(activeMoney,"expense");
  const monthlyEquivalent=annualisedIncome/12;
  const monthlyOutgoingEquivalent=annualisedOutgoing/12;
  const weeklyIncome=annualisedIncome/52;
  const fortnightlyIncome=annualisedIncome/26;
  const monthlyIncome=annualisedIncome/12;
  const annualIncome=annualisedIncome;
  const priorityCount=active.filter(i=>i.priority==="urgent"||i.priority==="high").length;
  const attentionSet=new Set([...overdue,...active.filter(i=>daysUntil(i.due)>=0&&daysUntil(i.due)<=ATTENTION_DAYS)].map(i=>i.id));
  const attentionCount=attentionSet.size;
  const hasItems=state.items.length>0;
  $("#scoreText").textContent=attentionCount?"Needs attention":"All clear";
  $("#scoreDetail").textContent=attentionCount?`${attentionCount} ${attentionCount===1?"item needs":"items need"} your attention · ${overdue.length} overdue · ${active.filter(i=>daysUntil(i.due)>=0&&daysUntil(i.due)<=ATTENTION_DAYS).length} due today`:hasItems?"Nothing needs your attention right now.":"Add something with the + button when you need to.";
  const badge=$("#statusBadge");
  if(badge){badge.textContent=attentionCount?"!":"✓";badge.classList.toggle("needs-attention",!!attentionCount)}
  $("#overdueCount").textContent=overdue.length;$("#soonCount").textContent=soon.length;$("#completeCount").textContent=completed.length;
  $("#upcomingCost").textContent=money(outgoing30);$("#monthCost").textContent=money(outgoing30);$("#yearCost").textContent=money(outgoing365);$("#incomingTotal").textContent=money(incoming30);$("#weeklyIncome").textContent=money(weeklyIncome);$("#monthlyIncome").textContent=money(monthlyIncome);$("#annualIncome").textContent=money(annualIncome);$("#incomingTotalMoney").textContent=money(incoming30);$("#incomingTotalCard").textContent=money(incoming30);$("#cashInBarLabel").textContent=money(incoming30);$("#cashflowLabelMoney").textContent=incoming30>outgoing30?"More coming in than going out":incoming30<outgoing30?"More going out than coming in":"Evenly matched";$("#itemCount").textContent=filteredItems().length;
  if($("#moneyCentreNet"))renderMoneyCentre(incoming30,outgoing30);if($("#documentsSummary"))renderDocuments();
  const net=incoming30-outgoing30,max=Math.max(incoming30,outgoing30,1);$("#cashflowNet").textContent=(net>=0?"+":"-")+money(Math.abs(net));$("#cashflowLabel").textContent=net>0?"More coming in than going out":net<0?"More going out than coming in":"Evenly matched";$("#cashIn").textContent=money(incoming30);$("#cashOut").textContent=money(outgoing30);$("#inBar").style.width=(incoming30/max*100)+"%";$("#outBar").style.width=(outgoing30/max*100)+"%";
  const titles={attention:["Needs attention",`Bills and admin due today or overdue`],all:["All items","Your life admin in one place"],overdue:["Overdue","Bills and admin that have passed their due date"],soon:["Due soon",`Bills and admin due within ${SOON_DAYS} days`],completed:["Completed","Finished bills, admin and incoming payments"],cost:["Upcoming costs","Outgoing money due soon"],income:["Incoming money","Money coming into your life"]};const t=titles[view.filter]||titles.all;$("#listTitle").textContent=t[0];$("#listSubtitle").textContent=t[1];
  renderAgenda();renderList(filteredItems());installIcons();syncCategoryActive();
}
function sum(items){return items.reduce((a,i)=>a+Number(i.cost||0),0)}
function occurrenceDates(item,start,end){
  const out=[];
  let d=dateObj(item.due);
  if(Number.isNaN(d.getTime())||d>end)return out;
  if(!item.repeat||item.repeat==="Doesn't repeat"){if(d>=start&&d<=end)out.push(d);return out}
  let guard=0;
  while(d<start&&guard++<5000){const n=nextOccurrenceDate(d,item.repeat);if(!n)break;d=n}
  guard=0;
  while(d<=end&&guard++<5000){if(d>=start)out.push(new Date(d));const n=nextOccurrenceDate(d,item.repeat);if(!n)break;d=n}
  return out;
}
function projectedSum(items,start,end,kind){
  return items.reduce((total,item)=>{
    if(item.completed)return total;
    if(kind && item.moneyType!==kind)return total;
    const value=Number(item.cost||0);
    if(value<=0)return total;
    return total+occurrenceDates(item,start,end).length*value;
  },0);
}
function annualisedRecurring(items,kind){
  return items.reduce((total,item)=>{
    if(item.completed||item.moneyType!==kind)return total;
    const value=Number(item.cost||0);if(value<=0)return total;
    const r=item.repeat;
    if(r==="Daily")return total+value*365;
    if(r==="Weekly")return total+value*52;
    if(r==="Fortnightly")return total+value*26;
    if(r==="Monthly")return total+value*12;
    if(r==="Every 3 months")return total+value*4;
    if(r==="Every 6 months")return total+value*2;
    if(r==="Yearly")return total+value;
    return total;
  },0);
}
function syncCategoryActive(){$$('.category-chip').forEach(x=>x.classList.toggle('active',x.dataset.category===view.category));$$('[data-item-filter]').forEach(x=>x.classList.toggle('active',x.dataset.itemFilter===view.filter))}
function renderAgenda(){
  const itemList=state.items.filter(i=>!i.completed).filter(i=>{const d=daysUntil(i.due);return view.agenda==="today"?d===0:d>=0&&d<=7}).map(i=>({kind:"item",id:i.id,date:i.due,time:"",title:i.title,moneyType:i.moneyType,cost:i.cost,pinned:i.pinned}));
  const eventList=[];
  (state.events||[]).forEach(e=>{
    const start=dateObj(e.date);
    if(Number.isNaN(start.getTime()))return;
    const dates=eventOccurrenceDates(e, today(), new Date(today().getTime()+7*86400000));
    dates.forEach(d=>{
      const key=dateKey(d), days=daysUntil(key);
      if(view.agenda==="today" ? days===0 : days>=0&&days<=7) eventList.push({kind:"event",id:e.id,date:key,time:e.time||"",title:e.title,eventType:e.type||"event",occurrence:key});
    });
  });
  const list=[...itemList,...eventList].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,6);
  $("#agendaCount").textContent=list.length?(view.agenda==="today"?`${list.length} ${list.length===1?"thing":"things"} today`:`${list.length} coming up`):view.agenda==="today"?"Nothing scheduled today":"Nothing scheduled this week";
  $("#agendaList").innerHTML=list.length?list.map(x=>{const d=daysUntil(x.date),amt=x.cost?`<span class="agenda-amount ${x.moneyType==="income"?"income-text":""}">${x.moneyType==="income"?"+":"-"}${money(x.cost)}</span>`:"";const action=x.kind==="item"?`data-open="${x.id}"`:`data-calendar-event="${x.id}"`;const label=x.kind==="item"?(d===0?"Today":d===1?"Tomorrow":formatDate(x.date)):(x.time?`${x.time} · ${x.eventType}`:`Calendar · ${x.eventType}`);return `<button type="button" class="agenda-item ${x.kind==="item"?(d<0?"overdue":d<=2?"soon":""):"event-item"}" ${action}><span class="agenda-dot ${x.kind==="event"?"agenda-event-dot":""}"></span><span class="agenda-main"><span class="agenda-title">${x.pinned?"★ ":""}${esc(x.title)}</span><span class="agenda-date">${label}</span></span>${amt}</button>`}).join(""):`<div class="agenda-empty">You're clear. Add something with the + button when you need to.</div>`
}
function eventOccurrenceDates(e,start,end){
  const out=[];
  let d=dateObj(e.date);
  if(Number.isNaN(d.getTime()))return out;
  const repeat=e.repeat||"Doesn't repeat";
  if(repeat==="Doesn't repeat"){if(d>=start&&d<=end)out.push(new Date(d));return out}
  let guard=0;
  while(d<start&&guard++<5000){const n=nextOccurrenceDate(d,repeat);if(!n)break;d=n}
  guard=0;
  while(d<=end&&guard++<5000){if(d>=start)out.push(new Date(d));const n=nextOccurrenceDate(d,repeat);if(!n)break;d=n}
  return out;
}
function renderList(list){const el=$("#itemList");if(!list.length){el.innerHTML=`<div class="empty">${view.search?"No items match your search.":view.filter==="attention"?"No upcoming items. Nice work.":"Nothing to show here."}</div>`;return}el.innerHTML=list.map(i=>{const d=daysUntil(i.due),c=cats[i.category]||cats.other,st=status(i),date=i.completed?`Completed ${formatDate(i.completedAt||i.due)}`:d<0?`${Math.abs(d)}d late`:d===0?"Today":d===1?"Tomorrow":formatDate(i.due);return `<div class="item ${st} ${i.pinned?"pinned":""}" data-id="${i.id}"><button type="button" class="check-button" data-complete="${i.id}" aria-label="${i.completed?"Reopen":"Complete"}">${i.completed?icons.check:""}</button><button type="button" class="item-icon" data-open="${i.id}" aria-label="Open ${esc(i.title)}">${iconFor(i.category)}</button><button type="button" class="item-main" data-open="${i.id}"><div class="item-title">${i.pinned?`<span class="pin-mark">★</span> `:""}${priorityRank(i.priority)<2?`<span class="priority-pill ${i.priority}">${priorityLabel(i.priority)}</span> `:""}${esc(i.title)}</div><div class="item-meta"><span>${esc(c.name)}</span>${i.repeat&&i.repeat!=="Doesn't repeat"?`<span>· ${icons.repeat} ${esc(i.repeat)}</span>`:""}${Number(i.cost)>0?`<span class="${i.moneyType==="income"?"income-text":""}">· ${i.moneyType==="income"?"+":"-"}${money(i.cost)}</span>`:""}</div></button><button type="button" class="item-date" data-open="${i.id}"><div class="date-label">${i.completed?"Done":d<0?"Overdue":d<=14?"Coming up":"Due"}</div><div class="date-value">${date}</div></button></div>`}).join("")}
function openSettings(){const theme=state.settings.theme||"forest";const cards=Object.entries(THEMES).map(([key,t])=>`<button type="button" class="theme-card ${theme===key?"selected":""}" data-theme-choice="${key}"><span class="theme-preview ${key}"><i></i><b></b></span><span class="theme-name">${t.name}</span></button>`).join("");openModal(`<div class="modal-header"><h3>Settings</h3><button type="button" class="close" id="close">${icons.close}</button></div><div class="setting-row"><div><b>Your name</b><small>Used on the home screen</small></div><button type="button" class="text-btn" id="nameEdit">${state.name?esc(state.name):"Add name"}</button></div><div class="setting-row"><div><b>Notifications</b><small>Request browser permission where supported</small></div><button type="button" class="toggle ${state.settings.notifications?"on":""}" id="notify"><i></i></button></div><div class="setting-row" style="display:block"><div><b>Appearance</b><small>Choose a colour scheme for Life Admin</small></div><div class="theme-grid">${cards}</div><div class="appearance-note">Your choice is saved on this device and applies instantly.</div></div><div class="setting-row"><div><b>Backup</b><small>Export your data or restore a previous backup</small></div><div><button type="button" class="text-btn" id="export">Export</button> <button type="button" class="text-btn" id="import">Import</button></div></div><div class="setting-row"><div><b>Data</b><small>${state.items.length} item${state.items.length===1?"":"s"} stored locally</small></div><button type="button" class="text-btn" id="clearData">Clear all</button></div><p style="font-size:11px;color:var(--muted);margin-top:18px">Life Admin V${APP_VERSION} ${APP_CHANNEL} · Local-first build</p>`);$("#close").onclick=closeModal;$$('[data-theme-choice]').forEach(btn=>btn.onclick=()=>{state.settings.theme=btn.dataset.themeChoice;applyTheme(state.settings.theme);save();openSettings()});$("#nameEdit").onclick=()=>{const n=prompt("What should we call you?",state.name);if(n!==null){state.name=n.trim();save();openSettings()}};$("#notify").onclick=async()=>{if("Notification" in window){const p=await Notification.requestPermission();state.settings.notifications=p==="granted";save();openSettings()}else toast("Notifications aren't supported here")};$("#export").onclick=exportData;$("#import").onclick=()=>{$("#fileInput").accept=".json,application/json";$("#fileInput").onchange=importData;$("#fileInput").click()};$("#clearData").onclick=()=>{if(confirm("Delete every Life Admin item and document? This cannot be undone.")){const theme=state.settings.theme||"forest";state={name:state.name,items:[],events:[],documents:[],settings:{notifications:false,theme}};idbClearFiles();save();closeModal()}}}
function openModal(html){$("#modal").innerHTML=html;$("#modalBackdrop").classList.remove("hidden");installIcons()}
function closeModal(){$("#modalBackdrop").classList.add("hidden")}
function categoryOptions(selected){return Object.entries(cats).map(([k,v])=>`<option value="${k}" ${k===selected?"selected":""}>${v.name}</option>`).join("")}
function repeatOptions(selected){return ["Doesn't repeat","Weekly","Fortnightly","Monthly","Every 3 months","Every 6 months","Yearly"].map(x=>`<option ${x===selected?"selected":""}>${x}</option>`).join("")}
function formHtml(item={},preset="") {const isEdit=!!item.id,due=item.due||iso(today()),p=preset?preset:"";return `<div class="modal-header"><h3>${isEdit?"Edit item":"Add life admin"}</h3><button type="button" class="close" id="close">${icons.close}</button></div>${!isEdit&&!p?`<div class="quick-grid" style="margin-bottom:15px"><button type="button" class="quick-choice" data-preset="bill">${icons.money}<span>Bill</span></button><button type="button" class="quick-choice" data-preset="payday">${icons.income}<span>Payday</span></button><button type="button" class="quick-choice" data-preset="car">${icons.car}<span>Car</span></button><button type="button" class="quick-choice" data-preset="reminder">${icons.calendar}<span>Reminder</span></button></div>`:""}<form id="itemForm"><div class="form-grid"><div class="field"><label>What needs remembering?</label><input id="title" required maxlength="100" value="${esc(item.title)}" placeholder="e.g. Car registration"></div><div class="field"><label>Category</label><select id="category">${categoryOptions(item.category||((p==="payday")?"income":p==="car"?"car":"home"))}</select></div><div class="field"><label>Due date</label><input id="due" type="date" required value="${due}"></div><div class="field"><label>Repeat</label><select id="repeat">${repeatOptions(item.repeat||"Doesn't repeat")}</select></div><div class="field"><label>Priority</label><select id="priority"><option value="urgent" ${item.priority==="urgent"?"selected":""}>Urgent</option><option value="high" ${item.priority==="high"?"selected":""}>Important</option><option value="normal" ${(!item.priority||item.priority==="normal")?"selected":""}>Normal</option><option value="low" ${item.priority==="low"?"selected":""}>Low</option></select></div><div class="field"><label>Money <span class="muted">(optional)</span></label><select id="moneyType"><option value="expense" ${item.moneyType!=="income"?"selected":""}>Outgoing — this costs me money</option><option value="income" ${item.moneyType==="income"?"selected":""}>Incoming — this pays me money</option></select></div><div class="field"><label id="moneyLabel">${item.moneyType==="income"?"Amount coming in":"Amount going out"}</label><input id="cost" type="number" min="0" step="0.01" value="${Number(item.cost||0)||""}" placeholder="0.00"></div><div class="field"><label>Provider / company <span class="muted">(optional)</span></label><input id="provider" maxlength="80" value="${esc(item.provider)}" placeholder="e.g. NRMA"></div><div class="field"><label>Notes <span class="muted">(optional)</span></label><textarea id="notes" maxlength="500" placeholder="Anything worth remembering...">${esc(item.notes)}</textarea></div></div><div class="form-actions">${isEdit?`<button type="button" class="danger-btn" id="delete">${icons.trash} Delete</button>`:""}<button type="button" class="secondary" id="cancel">Cancel</button><button type="submit" class="primary">Save ${isEdit?"changes":"item"}</button></div></form>`}
function presetData(p){const base={bill:{title:"Bill",category:"money",repeat:"Monthly",moneyType:"expense"},payday:{title:"Payday",category:"income",repeat:"Weekly",moneyType:"income"},car:{title:"Car service",category:"car",repeat:"Yearly",moneyType:"expense"},reminder:{title:"Reminder",category:"personal",repeat:"Doesn't repeat",moneyType:"expense"}}[p]||{};return base}
function openAdd(preset=""){openModal(formHtml(presetData(preset),preset));bindForm();if(preset){const x=presetData(preset);$("#title").value=x.title;$("#category").value=x.category;$("#repeat").value=x.repeat;$("#moneyType").value=x.moneyType;$("#moneyLabel").textContent=x.moneyType==="income"?"Amount coming in":"Amount going out";$("#title").focus()}}
function openEdit(id){const i=state.items.find(x=>x.id===id);if(i){openModal(formHtml(i));bindForm(i)}}
function bindForm(existing){$("#close").onclick=closeModal;$("#cancel").onclick=closeModal;if(existing)$("#delete").onclick=()=>{if(confirm("Delete this item?")){state.items=state.items.filter(x=>x.id!==existing.id);closeModal();save();toast("Item deleted")}};$("#moneyType").onchange=()=>$("#moneyLabel").textContent=$("#moneyType").value==="income"?"Amount coming in":"Amount going out";$("#itemForm").onsubmit=e=>{e.preventDefault();const data={title:$("#title").value.trim(),category:$("#category").value,due:$("#due").value,repeat:$("#repeat").value,cost:Number($("#cost").value||0),moneyType:$("#moneyType").value,priority:$("#priority").value,provider:$("#provider").value.trim(),notes:$("#notes").value.trim()};if(existing)Object.assign(existing,data);else state.items.push({id:uid(),...data,completed:false,createdAt:new Date().toISOString(),attachments:[],pinned:false,seriesId:uid()});closeModal();save();toast(existing?"Item updated":"Item added")}}
function openDetail(id){const i=state.items.find(x=>x.id===id);if(!i)return;const d=daysUntil(i.due),c=cats[i.category]||cats.other,atts=i.attachments||[],docs=linkedDocuments(i.id);const linkedMarkup=docs.map(f=>`<div class="attachment document-attachment"><button type="button" class="attachment-open" data-doc-open="${esc(f.id)}">${docIcon(f.type)}<span><b>${esc(f.name)}</b><small>${esc(docCategoryLabel(f.category))}</small></span></button><button type="button" class="attachment-unlink" data-unlink-doc="${esc(f.id)}">Unlink</button></div>`).join("");const legacyMarkup=atts.map((a,n)=>`<div class="attachment">${icons.paperclip}<span>${esc(a.name)}</span><button type="button" data-remove-attachment="${n}" data-id="${i.id}">Remove</button></div>`).join("");openModal(`<div class="modal-header"><h3>Life admin</h3><button type="button" class="close" id="close">${icons.close}</button></div><div class="detail-hero"><div class="detail-icon">${iconFor(i.category)}</div><div><h3>${esc(i.title)}</h3><p>${esc(c.name)}${i.provider?" · "+esc(i.provider):""}</p></div></div><div class="detail-grid"><div class="detail-box"><small>Due date</small><b>${formatDate(i.due)}</b></div><div class="detail-box"><small>Status</small><b>${i.completed?"Completed":d<0?"Overdue":d<=14?"Due soon":"Upcoming"}</b></div><div class="detail-box"><small>Repeat</small><b>${esc(i.repeat||"Doesn't repeat")}</b></div><div class="detail-box"><small>Priority</small><b>${priorityLabel(i.priority)}</b></div><div class="detail-box"><small>${i.moneyType==="income"?"Incoming":"Outgoing"}</small><b>${Number(i.cost)>0?(i.moneyType==="income"?"+":"-")+money(i.cost):"Not set"}</b></div></div>${i.notes?`<div class="field"><label>Notes</label><p class="detail-note">${esc(i.notes)}</p></div>`:""}<div class="field"><label>Quick actions</label><div class="snooze-grid"><button type="button" data-snooze="1" data-id="${i.id}">${icons.clock} +1 day</button><button type="button" data-snooze="7" data-id="${i.id}" class="primaryish">${icons.clock} +7 days</button></div></div><div class="field" style="margin-top:15px"><div class="attachment-heading"><label>Attachments</label>${docs.length?`<span class="attachment-count">${docs.length} linked</span>`:""}</div><div class="attachment-list">${linkedMarkup}${legacyMarkup}${!linkedMarkup&&!legacyMarkup?`<div class="empty">No attachments yet.</div>`:""}</div></div><div class="form-actions"><button type="button" class="secondary" id="pinBtn">${icons.pin} ${i.pinned?"Unpin":"Pin"}</button><button type="button" class="secondary" id="edit">${icons.edit} Edit</button><button type="button" class="secondary" id="attach">${icons.paperclip} Attach</button><button type="button" class="primary" id="done">${i.completed?"Reopen":"Complete"}</button></div>`);$("#close").onclick=closeModal;$("#edit").onclick=()=>openEdit(id);$("#attach").onclick=()=>openDocumentPicker(id);$("#pinBtn").onclick=()=>{i.pinned=!i.pinned;save();openDetail(id)};$("#done").onclick=()=>{toggleComplete(id);closeModal()}}
function toggleComplete(id){const i=state.items.find(x=>x.id===id);if(!i)return;if(!i.completed){i.completed=true;i.completedAt=iso(today());const next=nextDue(i);if(next)state.items.push({...i,id:uid(),due:next,completed:false,completedAt:null,attachments:[],seriesId:i.seriesId||uid()})}else{i.completed=false;i.completedAt=null}save();toast(i.completed?"Completed":"Reopened")}
function snooze(id,days){const i=state.items.find(x=>x.id===id);if(!i)return;const d=dateObj(i.due);d.setDate(d.getDate()+days);i.due=iso(d);save();closeModal();toast(`Moved ${days} day${days===1?"":"s"}`)}
async function attachFile(id){openDocumentUpload(id)}

function importData(e){const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!Array.isArray(x.items))throw Error();state={name:x.name||"",items:x.items.map(i=>({...i,pinned:!!i.pinned,priority:i.priority||"normal",seriesId:i.seriesId||null,attachments:i.attachments||[],completed:!!i.completed})),events:Array.isArray(x.events)?x.events:[],documents:Array.isArray(x.documents)?x.documents:[],settings:{notifications:false,theme:"forest",...(x.settings||{})}};applyTheme(state.settings.theme);save();closeModal();toast("Backup restored")}catch{alert("That file isn't a valid Life Admin backup.")}};r.readAsText(f)}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);requestAnimationFrame(()=>t.classList.add("show"));setTimeout(()=>{t.classList.remove("show");setTimeout(()=>t.remove(),220)},1800)}
function bindGlobal(){document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.closest(".hero-card[role=\"button\"]")){e.preventDefault();switchTab("items","attention")}});document.addEventListener("click",e=>{
  const backdrop=e.target.closest("#modalBackdrop");if(backdrop&&e.target===backdrop){closeModal();return}
  const preset=e.target.closest("[data-preset]");if(preset){openAdd(preset.dataset.preset);return}
  const snoozeBtn=e.target.closest("[data-snooze]");if(snoozeBtn){snooze(snoozeBtn.dataset.id,Number(snoozeBtn.dataset.snooze));return}
  const unlink=e.target.closest("[data-unlink-doc]");if(unlink){unlinkDocumentFromItem(unlink.dataset.unlinkDoc);return}
  const remove=e.target.closest("[data-remove-attachment]");if(remove){const i=state.items.find(x=>x.id===remove.dataset.id);if(i){i.attachments.splice(Number(remove.dataset.removeAttachment),1);save();openDetail(i.id)}return}
  const complete=e.target.closest("[data-complete]");if(complete){e.stopPropagation();toggleComplete(complete.dataset.complete);return}
  const open=e.target.closest("[data-open]");if(open){openDetail(open.dataset.open);return}
  const cat=e.target.closest(".category-chip");if(cat){view.category=cat.dataset.category;view.filter="all";render();return}
  const hero=e.target.closest(".hero-card");if(hero){switchTab("items","attention");return}
  const stat=e.target.closest(".stat-card");if(stat){switchTab("items",stat.dataset.filter||"all");return}
  const agenda=e.target.closest("[data-agenda]");if(agenda){view.agenda=agenda.dataset.agenda;$$('[data-agenda]').forEach(x=>x.classList.toggle('active',x.dataset.agenda===view.agenda));renderAgenda();return}
  const itemFilter=e.target.closest("[data-item-filter]");if(itemFilter){view.filter=itemFilter.dataset.itemFilter;render();return}
  const homeAll=e.target.closest("#homeViewAll");if(homeAll){switchTab("items");return}
  const homeMoney=e.target.closest("#homeMoney");if(homeMoney){switchTab("money");return}
  const homeIncome=e.target.closest("#homeIncome");if(homeIncome){switchTab("money");return}
  const calDate=e.target.closest("[data-cal-date]");if(calDate){calendarView.selected=calDate.dataset.calDate;const d=dateObj(calendarView.selected);calendarView.month=new Date(d.getFullYear(),d.getMonth(),1);renderCalendar();return}
  const calEvent=e.target.closest("[data-calendar-event]");if(calEvent){openCalendarEvent(calEvent.dataset.calendarEvent);return}
  if(e.target.closest("#calendarPrev")){calendarView.month=new Date(calendarView.month.getFullYear(),calendarView.month.getMonth()-1,1);calendarView.selected=dateKey(calendarView.month);renderCalendar();return}
  if(e.target.closest("#calendarNext")){calendarView.month=new Date(calendarView.month.getFullYear(),calendarView.month.getMonth()+1,1);calendarView.selected=dateKey(calendarView.month);renderCalendar();return}
  if(e.target.closest("#calendarToday")){calendarView.month=startOfMonth(today());calendarView.selected=dateKey(today());renderCalendar();return}
  if(e.target.closest("#calendarAdd")){openCalendarAdd();return}
  const nav=e.target.closest(".nav-item");if(nav){switchTab(nav.dataset.tab);return}
  const add=e.target.closest("#navAdd");if(add){openAdd();return}
  if(e.target.closest("#settingsBtn")){openSettings();return}
  if(e.target.closest("#moreHeaderBtn")){switchTab("more");return}
  if(e.target.closest("#settingsMenuBtn")){openSettings();return}
  if(e.target.closest("#exportMenuBtn")){exportData();return}
  if(e.target.closest("#clearSearch")){$("#searchInput").value="";view.search="";$("#clearSearch").classList.add("hidden");render();return}
  if(e.target.closest(".income-card")){view.filter="income";render();window.scrollTo({top:250,behavior:"smooth"});return}
  if(e.target.closest("#moneyViewBtn")){switchTab("money");return}
  const docOpen=e.target.closest("[data-doc-open]");if(docOpen){openDocumentRecord(docOpen.dataset.docOpen);return}
  const docDelete=e.target.closest("[data-doc-delete]");if(docDelete){deleteDocument(docDelete.dataset.docDelete);return}
  if(e.target.closest("#documentsBtn")){openDocuments();return}
});$("#searchInput").addEventListener("input",e=>{view.search=e.target.value;$("#clearSearch").classList.toggle("hidden",!view.search);if(view.search)view.filter="all";render()})}
function boot(){applyTheme(state.settings?.theme||"forest");installIcons();initTabs();bindGlobal();render();updateGreeting();setInterval(updateGreeting,60000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();

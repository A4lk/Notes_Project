const NotesObj= new Notes();
window.onload=getAllNotes;



reverseBtn.onclick=reverseNote;//To Call button in HTML
async function reverseNote(){
    NotesObj.reverseOrder=!NotesObj.reverseOrder;
    getAllNotes();
}



clearAllBtn.onclick=()=>{
    NotesObj.clear();
    getAllNotes();
}




document.addEventListener("submit",(e)=>{
e.preventDefault();
let target=e.target;

if (target && target.classList.contains("add-note")){
  addNote(target);

}else if  (target && target.classList.contains("update-note")){
  
let note={
    id:parseInt(target.dataset.id),
    text:target.querySelector('textarea').value
}
updateNote(note);

}
})

document.addEventListener('click',(e)=>{
 let target=e.target;

 if (target && target.classList.contains("delete")){
    let noteID=parseInt(target.dataset.id);
    deleteNote(noteID)
 }else if (target && target.classList.contains("edit")){
    
    editNote(target);
}})

async function addNote(target){
    let textArea=target.querySelector('textarea')
    let newArea=textArea.value;
    let add = await NotesObj.add({text:newArea});
    add.onsuccess=()=>{
        textArea.value='';
        getAllNotes();
    }
}

async function deleteNote(noteId){
    if (confirm('Are you sure?')){
        let deleteRequest = await NotesObj.delete(noteId);

        deleteRequest.onsuccess=()=>{
            document.getElementById('note-'+noteId).remove();
        }
    }else{
        return false
    }
}

function editNote(note){
    let id=note.dataset.id;
    let noteContainer=document.getElementById("note-"+id);
    let oldText= noteContainer.querySelector('.text').innerHTML;
    
    let form= `<form class="update-note" data-id="${id}">
        <textarea> ${oldText}</textarea>
        <button class="btn" type=""submit>تحديث</button>

    </form>`;
    noteContainer.innerHTML=form;

}

async function updateNote(note){
    let updateRequest = await NotesObj.update(note);
    updateNote.onsuccess=getAllNotes;
}

async function getAllNotes(){
    let request= await NotesObj.all();

    let notesArray=[];
    request.onsuccess=()=>{
        let cursor=request.result;

        if(cursor){
            notesArray.push(cursor.value);
            cursor.continue();
        }else{
            displayNotes(notesArray);
        }
    }
}
function displayNotes(notesArray){

    let ULElemnt=document.createElement('ul');
    
    for(let i =0;i<notesArray.length;i++){

        let LIElemt=document.createElement('li')
        let note=notesArray[i];
        console.log(note);
        LIElemt.className='note';
        LIElemt.id='note-'+note.id;
        LIElemt.innerHTML=`
        <div class="">
        <img src="imgs/edit-icon.png" class="edit" data-id="${note.id}">
        <img src="imgs/delete-icon.png" class="delete" data-id="${note.id}">
        </div>
        <div class="text">${note.text}</div>
        `;
        ULElemnt.append(LIElemt);
    }
    document.getElementById('notes').innerHTML='';
    document.getElementById('notes').append(ULElemnt);
}

async function clearAll(){
    let request= await NotesObj.clear();
}
//getAllNotes();
//clearAll();
//addNote();

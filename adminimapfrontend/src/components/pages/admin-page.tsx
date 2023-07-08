import React, { useState } from 'react';
import { CloseIcon, FileAddIcon, FileOpenIcon, FileSaveIcon, FileDeleteIcon, ImageDeleteIcon, ImagesIcon, UploadImagesIcon } from '../icons/icons';
import { INoteDTO } from '../../types';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { HeaderLayout } from '../layout/header-layout';
import { fetchGet, fetchGetAuth, fetchPostAuth } from '../../utils';


const noteTextDefault = `---
title: Note title
username: your username
tags: 0
latitude: 43.23378770722032
longitude: 76.97539792869954
---

## Example
This is template for new note.
`;

const AdminPage: React.FunctionComponent = () => {
  const [currentNumber, setCurrentNumber] = useState<string | null>(null);
  const [noteText, setNoteText] = useState(noteTextDefault);

  const [noteList, setNoteList] = useState<Array<INoteDTO>>([]);
  const [displayModalNotes, setDisplayModalNotes] = useState('none');

  const [imageList, setImageList] = useState<Array<string>>([]);
  const [displayModalImages, setDisplayModalImages] = useState('none');

  const handleNewFileClick = () => {
    setNoteText(noteTextDefault);
    setCurrentNumber(null);
  }

  const handleOpenNoteModalClick = async () => {
    const notes = await fetchGet<Array<INoteDTO>>({
      url:`api/notes?query=u/`,
      default: [],
      headers: { "Content-Type": "application/json" },
    });
    setNoteList(notes);
    setDisplayModalNotes('block');
  }

  const handleNoteClick = async (number: string) => {
    const text = await fetchGetAuth<string | null>({
      url:`api/admin0/notes/${number}`,
      default: null,
      isText: true,
      headers: { "Content-Type": "application/json" }
    });
    if (text){
      setNoteText(text);
      setCurrentNumber(number);
    } else {
      alert(`Note with number ${number} not found`);
    }
    setDisplayModalNotes('none');
  }

  const handleSaveFileClick = async () => {
    const confirmText = currentNumber 
      ? `Save "${currentNumber}" note changes?` 
      : `Save new note?`;
    if (window.confirm(confirmText) === true) {
      const data = await fetchPostAuth<INoteDTO | null>({
        url:'api/admin0/notes',
        method: 'POST',
        default: null,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: currentNumber,
          text: noteText,
        })
      });
      if (data) {
        setCurrentNumber(data.number);
      } else {
        alert("Failed to save note");
      }
    }
  }

  const handleDeleteFileClick = async () => {
    if (currentNumber && window.confirm(`Are you sure want to delete note "${currentNumber}"`) === true) {
      const data = await fetchPostAuth<INoteDTO | null>({
        url: `api/admin0/notes/${currentNumber}`,
        method: 'DELETE',
        default: null,
        headers: { "Content-Type": "application/json" }
      });
      if (data) {
        setNoteText(noteTextDefault);
        setCurrentNumber(null);
      } else {
        alert("Failed to delete note");
      }
    }
  }

  const handleOpenImageModalClick = async () => {
    const images = await fetchGetAuth<Array<string>>({
      url:`api/admin0/images/${currentNumber}`,
      default: [],
      headers: { "Content-Type": "application/json" },
    });
    setImageList(images);
    setDisplayModalImages('block');
  }

  const handleUploadImageClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length) {
      const formData = new FormData();
      Array.from(fileList).forEach((file => 
        formData.append('files', file, file.name)
      ));

      const images = await fetchPostAuth<Array<string>>({
        url: `api/admin0/images/${currentNumber}`,
        method: 'POST',
        default: [],
        body: formData,
      });
      setImageList(images);
    }
    event.target.files = null;  
  }

  const handleDeleteImageClick = async (image: string) => {
    if (window.confirm(`Are you sure want to delete "${image}"`) === true) {
      const images = await fetchPostAuth<Array<string>>({
        url: `api/admin0/images/${image}/${currentNumber}`,
        method: 'DELETE',
        default: [],
        headers: { "Content-Type": "application/json" }
      });
      setImageList(images);
    }
  }

  const handleImageClick = async (image: string) => {
    const imageTag = `\n\n<p><img src="images/${image}" alt="" title=""></p>`;
    setNoteText(noteText + imageTag);
  }

  return (
    <>
      <HeaderLayout />

      <main className="w4-main" style={{height: '93%'}}>
        <div data-color-mode="light" className="" style={{height: '99%'}}>
          <MDEditor
            enableScroll={false}
            visibleDragbar={false}
            fullscreen={false}
            preview={'edit'} 
            value={noteText}
            onChange={(value) => setNoteText(value ? value : '')}
            height={'100%'}
            commands={[
              commands.group(
                [
                  {
                    name: 'newfile',
                    keyCommand: 'newfile',
                    buttonProps: { 'aria-label': 'Create new note', title: 'Create new note' },
                    icon: (
                      <div className='w4-flex w4-button-group--admin'>
                        New &nbsp; {FileAddIcon}
                      </div>
                    ),
                    execute: handleNewFileClick,
                  },
                  {
                    name: 'openfile',
                    keyCommand: 'openfile',
                    buttonProps: { 'aria-label': 'Open note', title: 'Open note' },
                    icon: (
                      <div className='w4-flex w4-button-group--admin'>
                        Open &nbsp; {FileOpenIcon}
                      </div>
                    ),
                    execute: handleOpenNoteModalClick,
                  },
                  {
                    name: 'images',
                    keyCommand: 'images',
                    buttonProps: { 'aria-label': 'Note images', title: 'Note images', disabled: currentNumber == null },
                    icon: (
                      <div className='w4-flex w4-button-group--admin'>
                        Images &nbsp; {ImagesIcon}
                      </div>
                    ),
                    execute: handleOpenImageModalClick,
                  },
                  {
                    name: 'savefile',
                    keyCommand: 'savefile',
                    buttonProps: { 'aria-label': 'Save note changes', title: 'Save note changes' },
                    icon: (
                      <div className='w4-flex w4-button-group--admin'>
                        Save &nbsp; {FileSaveIcon}
                      </div>
                    ),
                    execute: handleSaveFileClick,
                  },
                  {
                    name: 'deletefile',
                    keyCommand: 'deletefile',
                    buttonProps: { 'aria-label': 'Delete note', title: 'Delete note', disabled: currentNumber == null },
                    icon: (
                      <div className='w4-flex w4-button-group--admin'>
                        Delete &nbsp; {FileDeleteIcon}
                      </div>
                    ),
                    execute: handleDeleteFileClick,
                  },   
                ],
                {
                  name: "file",
                  groupName: "file",
                  buttonProps: { "aria-label": "File commands" },
                  icon: (<>File</>),
                }
              ),
              commands.divider,
              {
                name: "info",
                keyCommand: 'info',
                icon: (<>number: {currentNumber}</>),
              }
            ]}
            // extraCommands={[]}
          />           
        </div>
      </main>

      <div className="w4-modal-background" style={{display: displayModalNotes}}>
        <div className='w4-margin-center' style={{marginTop: '25px', maxWidth: '400px'}}>
          <header className="w4-container w4-theme-cyan w4-flex-beetwen">
            Note list
            <div className="w4-button" onClick={() => setDisplayModalNotes('none')}>
              {CloseIcon}
            </div>
          </header>
          <div className="w4-container w4-theme-text" style={{overflow: 'scroll'}}>
            {noteList.map(note => (
              <div key={note.id} className="w4-search-result" onClick={() => handleNoteClick(note.number)}>
                <div className="w4-flex">
                  <span className="w4-dot" />
                  <h3>{note.title}</h3>
                </div>
              </div>
            ))}
          </div> 
        </div>  
      </div>

      <div className="w4-modal-background" style={{display: displayModalImages}}>
        <div className='w4-margin-center' style={{marginTop: '25px', maxWidth: '400px'}}>
          <header className="w4-container w4-theme-cyan w4-flex-beetwen">
            Image list
            <div className="w4-button" onClick={() => setDisplayModalImages('none')}>
              {CloseIcon}
            </div>
          </header>
          <div className="w4-container w4-theme-text" style={{fontSize: '12px'}}>
            <label htmlFor="file-upload" className="w4-button w4-button-primary w4-margin-bottom">
              {UploadImagesIcon} &nbsp; Upload images
            </label>
            <input
              id="file-upload"
              style={{display: 'none'}}
              type="file"
              accept="image/png, image/gif, image/jpeg, image/jpg"
              multiple
              onChange={(e) => handleUploadImageClick(e)} 
            />
            {imageList.map(image => (
              <div key={image} className="w4-margin-bottom">
                <div className='w4-flex-beetwen'>
                  <div className="w4-flex w4-search-result" onClick={() => handleImageClick(image)}>
                    <span className="w4-dot" />
                    <div>images/{image}</div>
                  </div>
                  <div className='w4-button w4-button-primary' style={{maxWidth: '20px', maxHeight: '20px'}} title='Delete image' onClick={() => handleDeleteImageClick(image)}>
                    {ImageDeleteIcon}
                  </div> 
                </div>    
              </div>
            ))}
          </div> 
        </div>  
      </div>
    </>
  )
}

export default AdminPage;

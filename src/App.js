import './App.css';
import React, { useState } from 'react';

function App() {

  const [imgText, setImgText] = useState('');

  // Triggers openFile and handles image text data after a file is chosen
  function open(){
    openFile(function(txt){
      // Render the img tag
      setImgText(txt);

      // Data conversion here
      let noHead = txt.replace("data:image/jpeg;base64,","");
      let buff = Buffer.from(noHead, 'base64');
      let raw = buff.toString('hex');

      // Insert text into textfield
      document.getElementById('tbMain').value = raw;

      // DEBUG
      console.log("DEBUG", {txt, raw});
    });
  }

  // Create an input element to store the file and open a file prompt
  function openFile(callBack){
    var element = document.createElement('input');
    element.setAttribute('type', "file");
    element.setAttribute('id', "btnOpenFile");
    element.onchange = function(){
        readText(this, callBack);
          document.body.removeChild(this);
        }  
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
  }
  
  // Read the image as text data
  function readText(filePath, callBack) {
    var reader;
    
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      reader = new FileReader();
    } 
    else {
      alert('The File APIs are not fully supported by your browser. Fallback required.');
      return false;
    }
    
    var output = ""; //placeholder for text output
    
    if(filePath.files && filePath.files[0]) {           
      reader.onload = function (e) {
        output = e.target.result;
        callBack(output);
      };

      // This is where we'll experiment with different encodings for now...
      console.log("File!", filePath.files[0]);

      // https://stackoverflow.com/questions/40790042/filereader-which-encodings-are-supported

      // reader.readAsText(filePath.files[0]); // UTF-8
      // reader.readAsText(filePath.files[0], 'ascii'); // ASCII 

      // reader.readAsBinaryString(filePath.files[0]); // Binary
      reader.readAsDataURL(filePath.files[0]); // base64
    }
    //end if html5 filelist support
    else {
      //this is where you could fallback to Java Applet, Flash or similar
      return false;
    }       
    
    return true;
  }

  // Re-render the image on the page when image text is updated
  function textToImage(e){
    let text = e.target.value;
    
    // must be an even number of digits - do nothing if it is not to avoid a typerror on buffer
    var strLen = text.length
    if (strLen % 2 !== 0) {
      //do nothing
    }
    else{
      let buff = Buffer.from(text, 'hex');
      let b64  = buff.toString('base64');
      
      console.log("RENDER", b64)
      setImgText("data:image/jpeg;base64,"+b64);
    }
  }

  return (
    <div className="App">
      <div>
        <button id='btnOpen' onClick={open}>Open</button>
        <textarea id='tbMain' 
          onChange={textToImage}
        ></textarea>
        <img id="glitch" src={imgText} alt="Your file here." />
      </div>
    </div>
  );
}

export default App;

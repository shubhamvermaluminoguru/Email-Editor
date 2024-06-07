import { useState, useEffect, useRef } from 'react';
import './App.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Quill } from 'react-quill';

const emailTypes = {
  "Welcome" : [
    {name: 'Country Code', text: '#countryCode', placeholder: '+91'},
    {name: 'Contact Number', text: '#contactNumber', placeholder: '9898989898'},
    {name: 'Country Name', text: '#countryName', placeholder:'India'},
  ],
  "Purchase" : [
    {name: 'Name', text: '#name', placeholder: 'John Travor'},
    {name: 'Contact Number', text: '#contactNumber', placeholder: '9898989898'},
    {name: 'Purchase Title', text: '#purchaseTitle', placeholder: 'C1, C2, C3 ...'},
    {name : 'Tracsaction Id', text: '#transactionId', placeholder: 'T12345'},
    {name : 'Payment Method', text: '#paymentMethod', placeholder: 'Online'},
  ],

}
function App() {
  const editorRef = useRef(null);
  const [selectedType, setSelectedType] = useState(Object.keys(emailTypes)[0]);
  const [value, setValue] = useState('');
  const [template, setTemplate] = useState('');

  useEffect(()=>{
    setTemplate(value.replace(/#([a-zA-Z0-9]+)/g, (match, p1) => {
      const found = emailTypes[Object.keys(emailTypes).find(et => emailTypes[et].find(e => e.text === match))];
      if(found) {
        const val = found.find(e => e.text === match).placeholder;
        return `<span class="value">${val}</span>`;
      }
      return match;
    }));
  },[value])


  const addValue = (newValue) => {
    const ed = editorRef.current.getEditor();
    ed.editor.insertText(ed.getSelection().index, ` ${newValue} `);
    // setValue ()
    console.log(editorRef)
    setValue(editorRef.current.value)
  }
  return (
    <div className="App">
      <div style={{display:'flex', flexDirection:'row', gap: 20, padding:20}}>
        <div style={{flex:1}}> 
          <select onChange={(e) => setSelectedType(e.target.value)}>
            {Object.keys(emailTypes).map((key) => 
                <option key={key} value={key}>{key}
            </option>)}
          </select>
            <input type="text"/>
            <input type="text"/>
            <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', padding:20}}>
              {emailTypes[selectedType]?.map((obj, index) => 
                <button key={index} onClick={(e)=>addValue(obj.text)}>{obj.name}</button>
              )}
            
            </div>
            <ReactQuill theme="snow" value={value} onChange={setValue} ref={editorRef}/>
        </div>
        <div style={{flex:1, backgroundColor: '#eee', fontSize: 12, padding:10}}>
          <h3>Template</h3>
          <div dangerouslySetInnerHTML={{__html: template}} style={{textAlign: 'left'}}>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

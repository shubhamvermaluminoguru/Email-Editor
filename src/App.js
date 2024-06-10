import { useState, useEffect, useRef } from 'react';
import './App.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LineChart } from '@mui/x-charts/LineChart';
import { Quill } from 'react-quill';
import {pageHitsData} from './data'

console.log(pageHitsData)

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
  
  const [startDate, setStartDate ]=useState('');
  const [endDate, setEndDate]=useState('');

  const [graphData, setGraphData] = useState(pageHitsData);
  const [formattedGraphData, setFormmatedGraphData]= useState({})
  const [checkedCourseIds, setCheckedCourseIds] =useState(['c1', 'c3'])

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


  useEffect(()=>{
    const totalViewsByDate = restructureData(graphData);
    console.log(totalViewsByDate)
    setFormmatedGraphData(totalViewsByDate)
  },[startDate, endDate])

  // Function to restructure the data as per the desired format
  function restructureData(courseViews) {
    const totalViewsByDate = {};
    const subjects = {};

    const date1 = new Date(startDate);
    const date2 = new Date(endDate);

    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Calculate total views by date
    courseViews.forEach(view => {
      //Check if view is in valid date range
      if(startDate <= view.date && view.date <=endDate)
      {
    
        if (!totalViewsByDate[view.date]) {
          totalViewsByDate[view.date] = 1;
        } else {
          totalViewsByDate[view.date]++;
        }
  
        // Store views for each subject
        let subjectKey = `${view.courseId}_${view.courseName}`
        if (!subjects[subjectKey]) {
          subjects[subjectKey] = {};
        }
        const key = view.date;
        if (!subjects[subjectKey][key]) {
          subjects[subjectKey][key] = 1;
        } else {
          subjects[subjectKey][key]++;
        }
  
      }
  

    });

    const result = {
      totalViews: totalViewsByDate,
      subjects: subjects
    };

    return result;
  }


  return (
    <div className="App">

      <div>
        <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
        <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
      </div>

      <LineChart
        xAxis={[{ scaleType: 'point', data: Object.keys(formattedGraphData?.totalViews? formattedGraphData?.totalViews : {}) ? Object.keys(formattedGraphData?.totalViews? formattedGraphData?.totalViews : {}) : [] }]}
        series={[
          {
            label: "Total Views",
            curve: "catmullRom",
            data: Object.values(formattedGraphData?.totalViews? formattedGraphData?.totalViews : {}) ? Object.values(formattedGraphData?.totalViews? formattedGraphData?.totalViews : {}) : [],
          },
          ...Object.keys(formattedGraphData?.subjects? formattedGraphData?.subjects : {}).map((key) =>{
            if(checkedCourseIds.includes(key.split('_')[0]))
              {return {
                label: key,
                curve: "catmullRom",
                data: Object.values(formattedGraphData?.subjects[key] ? formattedGraphData?.subjects[key] :{}),
              }}

              return{
                label:key,
                data:[]
              }
            
          })
        ]}
        width={800}
        height={500}
        grid={{ vertical: true, horizontal: true }}
      />

      {/* <div style={{display:'flex', flexDirection:'row', gap: 20, padding:20}}>
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
      </div> */}
    </div>
  );
}

export default App;

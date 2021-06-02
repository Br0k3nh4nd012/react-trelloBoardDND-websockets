import 'antd/dist/antd.css';
import { Card } from 'antd';
import './App.css';
import { Typography } from 'antd';
import { DragDropContext , Droppable , Draggable  } from 'react-beautiful-dnd';
import { useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
// import axios from 'axios';





const { Text } = Typography;

const itemsFromBackend = [
  { id:1,name:'banana',category:'fruits',quantity:'2 nos',price: 15 },
  { id:2,name:'lays',category:'snack',quantity:'2 nos',price: 30 },
  { id:3,name:'rice',category:'essential',quantity:'10 kg',price: 720 },
  { id:4,name:'dairy Milk',category:'chocolate',quantity:'2 nos',price: 132 },
  { id:5,name:'carrot',category:'vegetable',quantity:'2 kg',price: 68 },
];

const tracker = {
  [0] : {
    name:'Placed',
    items: itemsFromBackend,
  },
  [1] : {
    name:'picking',
    items: [],
  },
  [2] : {
    name:'packing',
    items: [],
  },
  [3] : {
    name:'delivery',
    items: [],
  },
}

const onDragEnd = (result , items , setItems) => {
  console.log(result);
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = items[source.droppableId];
    const destColumn = items[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setItems({
      ...items,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  }
  else {
    const column = items[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setItems({
      ...items,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
}
function connect(){
  var sock = new SockJS('http://65.1.116.0:8000/websocket');
  var headers = { 'DOMAIN-NAME' : 'reliancedigital' ,'Content-Type': 'application/json' };
  var stompClient = Stomp.over(sock);
  stompClient.connect(headers,function (frame){
    console.log("Connected"+ frame);
    // stompClient.subscribe('/topic/greetings', function (greeting){
    //   showGreeting(JSON.parse(greeting.body).content);
    // });
  });
}

function App() {
  // var sock = new SockJS('http://65.1.116.0:8000/websocket');
//   sock.onopen = function() {
//     console.log('open');
// };
 connect();
// let Credentials = { username: "gokul" , password: "admin@123"};
//     let axiosConfig = { headers : { 'DOMAIN-NAME' : 'reliancedigital' ,'Content-Type': 'application/json' }}
//     axios.post('http://65.1.116.0:8000/employees/signin' , Credentials  ,  axiosConfig )
//     .then(res => {
      
//       if(res.status === 200){
//         localStorage.setItem('token' , "bearer "+res.data.token); 
//       }
//       else {
//         console.log("not logged in")
//       };
//       console.log(res.status)
//     }) 
//     .catch(error=> console.log(error));

  const [items , setItems] = useState(tracker);
  return (
    <div>
      <p style={{textAlign:'center' , fontSize:'30px' , fontFamily:'bold'}}>Order Component</p>
    <div style={{display:'flex' ,marginTop:'20px', justifyContent:'center' , height:'100%'}}>
      
      <DragDropContext onDragEnd={(result) =>  onDragEnd(result, items , setItems)}>
        {Object.entries(items).map(([colId , col] , index) => {
          return (
            <div style={{display:'flex' , flexDirection: "column", alignItems: "center" }} key ={colId}>
              <div style={{background:'rgb(109, 183, 206)' , padding:'15px 120px', width:'300px'}}>
                <Text strong type="secondary">{col.name}</Text>
              </div>
              <div style={{margin:'10px'}}>
              <Droppable droppableId={colId} key={colId}>
                {(provided , snapshot) => {
                  return(
                  <div 
                    style={{backgroundColor:snapshot.isDraggingOver ? 'rgb(113, 162, 177)' :'rgb(150, 167, 172)', width:'300px',paddingTop:'2px',paddingBottom:'2px', marginTop:'15px' , minHeight:'600px'}} 
                    {...provided.droppableProps}
                    ref={provided.innerRef}>

                  {col.items.map((item , index) => {
                    return(
                      <Draggable draggableId={String(item.id)} key={item.id} index={index}>
                        {(provided , snapshot) => {
                          return(
                            <div ref={provided.innerRef} 
                              {...provided.draggableProps} {...provided.dragHandleProps}
                              style={{ margin:'10px' , ...provided.draggableProps.style}}>
                              <Card title={item.name}  bordered={true}>
                                <p>{item.category}</p>
                                <p>{item.quantity}   {item.price}</p>
                              </Card>
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>)
                }}              
              </Droppable>
              </div>
            </div>)
        })}
      </DragDropContext>
    </div>
    </div>









    // <DragDropContext onDropEnd = {result => console.log(result)}>
    // <div className="App">
    //   <Row gutter={16}>
    //     <Col className="gutter-row" span={6}>
    //       <div style={{background:'rgb(109, 183, 206)' , padding:'10px'}}><Text strong type="secondary">placed</Text></div>
    //       <Droppable droppableId="placedItems" key="placed">
    //         {(provided) => {
    //           return (
    //             <div style={{background:'rgb(150, 167, 172)' , height:'max-content', padding:'10px 10px' , marginTop:'10px'}} {...provided.droppableProps} ref={provided.innerRef}>
    //             {items.filter((item) => item.status==="placed" ).map((item , index ) =>{
    //               return (
    //                 <Draggable key={item.itemName} draggableId={item.itemName} index={index}>

    //                   {(provided) => {
    //                     return (
    //                       <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
    //                         <Card  title={item.itemName} style={{ margin:'5px', textAlign:'center', margin:' 020px 20px' , ...provided.draggableProps.style }} bordered={true}    >
    //                           <p style={{padding:'20px auto'}}>{item.category}</p>
    //                           <p style={{padding:'20px auto'}}>{item.quantity}  {item.price}</p>
    //                         </Card>
    //                       </div>
    //                       )
    //                   }}
                      
    //               </Draggable>
    //               )
    //             })}
    //             {provided.placeholder}
    //           </div>)
    //         }}
          
    //       </Droppable>
    //     </Col>
    //     <Col className="gutter-row" span={6}>
    //       <div style={{background:'rgb(109, 183, 206)' , padding:'10px'}}><Text strong type="secondary">picking</Text></div>
    //       <div style={{background:'rgb(150, 167, 172)' , height:'max-content', padding:'10px',marginTop:'10px'}}>
    //       {items.filter((item) => item.status==="picking" ).map((item) =>{
    //           return (
    //             <Card title={item.itemName} key={item.itemName} style={{ margin:'5px', textAlign:'center', margin:' 020px 20px' }} bordered={true} >
    //             <p style={{padding:'20px auto'}}>{item.category}</p>
    //             <p style={{padding:'20px auto'}}>{item.quantity}  {item.price}</p>
    //           </Card>
    //           )
    //         })}
    //       </div>
    //     </Col>
    //     <Col className="gutter-row" span={6}>
    //       <div style={{background:'rgb(109, 183, 206)' , padding:'10px'}}><Text strong type="secondary">packing</Text></div>
    //       <div style={{background:'rgb(150, 167, 172)' , height:'max-content', padding:'10px',marginTop:'10px'}}>
            
    //       {items.filter((item) => item.status==="packing" ).map((item) =>{
    //           return (
    //             <Card title={item.itemName} key={item.itemName} style={{ margin:'5px', textAlign:'center', margin:' 020px 20px' }} bordered={true} >
    //             <p style={{padding:'20px auto'}}>{item.category}</p>
    //             <p style={{padding:'20px auto'}}>{item.quantity}  {item.price}</p>
    //           </Card>
    //           )
    //         })}
    //       </div>
    //     </Col>
    //     <Col className="gutter-row" span={6}>
    //       <div style={{background:'rgb(109, 183, 206)' , padding:'10px'}}><Text strong type="secondary">delivery</Text></div>
    //       <div style={{background:'rgb(150, 167, 172)' , height:'max-content', padding:'10px', marginTop:'10px'}}>
            
    //       {items.filter((item) => item.status==="delivered" ).map((item) =>{
    //           return (
    //             <Card title={item.itemName} key={item.itemName} style={{ margin:'5px', textAlign:'center', margin:' 020px 20px' }} bordered={true} >
    //             <p style={{padding:'20px auto'}}>{item.category}</p>
    //             <p style={{padding:'20px auto'}}>{item.quantity}  {item.price}</p>
    //           </Card>
    //           )
    //         })}
    //       </div>
    //     </Col>
    //   </Row>
    // </div>
    // </DragDropContext>
  );
}

export default App;

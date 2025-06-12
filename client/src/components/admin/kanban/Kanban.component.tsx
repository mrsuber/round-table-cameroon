// import React, { useState, useCallback, useRef } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import update from 'immutability-helper';

// const tasksList = [
//   { _id: 1, title: 'First Task', status: 'backlog' },
//   { _id: 2, title: 'Second Task', status: 'backlog' },
//   { _id: 3, title: 'Third Task', status: 'backlog' },
//   { _id: 4, title: 'Fourth Task', status: 'new' },
//   { _id: 5, title: 'Fifth Task', status: 'new' },
//   { _id: 6, title: 'Sixth Task', status: 'wip' },
//   { _id: 7, title: 'Seventh Task', status: 'review' },
//   { _id: 8, title: 'Eighth Task', status: 'review' },
//   { _id: 9, title: 'Ninth Task', status: 'done' },
//   { _id: 10, title: 'Tenth Task', status: 'done' },
// ];

// const channels:any = ['backlog', 'new', 'wip', 'review', 'done'];

// const labelsMap:any = {
//   backlog: 'Backlog',
//   new: 'To Do',
//   wip: 'In Progress',
//   review: 'Review',
//   done: 'Done',
// };

// const classes:any = {
//   board: {
//     display: 'flex',
//     margin: '0 auto',
//     width: '90vw',
//     fontFamily: 'Arial, "Helvetica Neue", sans-serif',
//   },
//   column: {
//     minWidth: 200,
//     width: '18vw',
//     height: '80vh',
//     margin: '0 auto',
//     backgroundColor: '#FCC8B2',
//   },
//   columnHead: {
//     textAlign: 'center',
//     padding: 10,
//     fontSize: '1.2em',
//     backgroundColor: '#C6D8AF',
//   },
//   item: {
//     padding: 10,
//     margin: 10,
//     fontSize: '0.8em',
//     cursor: 'pointer',
//     backgroundColor: 'white',
//   },
// };

// const Kanban = () => {
//   const [tasks, setTaskStatus] = useState<any>(tasksList);

//   const changeTaskStatus = useCallback(
//     (id:any, status:any) => {
//       // let task = tasks.find((task:any) => task._id === id);
//       // const taskIndex = tasks.indexOf(task);
//       // task = { ...task, status };
//       // const newTasks = update(tasks, {
//       //   [taskIndex]: { $set: task },
//       // });
//       // setTaskStatus(newTasks);
//     },
//     [tasks],
//   );

//   return (
//     <main>
//       <header> Kanban Board </header>
//       <DndProvider backend={HTML5Backend}>
//         <section style={classes.board}>
//           {channels.map((channel:any) => (
//             <KanbanColumn key={channel} status={channel} changeTaskStatus={changeTaskStatus}>
//               <div style={classes.column}>
//                 <div style={classes.columnHead}>{labelsMap[channel]}</div>
//                 <div>
//                   {tasks
//                     .filter((item:any) => item.status === channel)
//                     .map((item:any) => (
//                       <KanbanItem key={item._id} id={item._id}>
//                         <div style={classes.item}>{item.title}</div>
//                       </KanbanItem>
//                     ))}
//                 </div>
//               </div>
//             </KanbanColumn>
//           ))}
//         </section>
//       </DndProvider>
//     </main>
//   );
// };

// export default Kanban;

// interface KanbanColumnProps {
//   status: any;
//   changeTaskStatus: any;
//   children: any;
// }

// export const KanbanColumn = ({ status, changeTaskStatus, children }: KanbanColumnProps) => {
//   const ref = useRef(null);
//   const [, drop] = useDrop({
//     accept: 'card',
//     drop(item: any) {
//       changeTaskStatus(item.id, status);
//     },
//   });
//   drop(ref);
//   return <div ref={ref}>{children}</div>;
// };

// interface KanbanItemProps {
//   id: any;
//   children: any;
// }

// export const KanbanItem = ({ id, children }: KanbanItemProps) => {
//   console.log('kanban id', id)
//   const ref = useRef(null);
//   const [{ isDragging }, drag] = useDrag({
//     type: 'card',
//     item: { type: 'card', id },
//     collect: (monitor:any) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });
//   console.log('isDragging', isDragging);
//   const opacity = isDragging ? 0.5 : 1;
//   drag(ref);
//   return (
//     <div ref={ref} style={{ opacity }}>
//       {children}
//     </div>
//   );
// };
export const data = {id: ''}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import CommentForm from './components/CommentForm';
import CommentsList from './components/CommentsList';
import SortingPanel from './components/SortingPanel';
import Pagination from './components/Pagination';
import { buildTree } from './funcs/buildTree';

const API_URL = "https://localhost:7235/api/comments";

function App() {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  const [isDesc, setIsDesc] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}?page=${page}&sortBy=${sortBy}&desc=${isDesc}`
      );

      const tree = buildTree(response.data.allItems);

      const pagedRoots = response.data.rootItems.map(root =>
        tree.find(c => c.id === root.id)
      );

      setComments(pagedRoots);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchComments();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7235/commentHub")
      .withAutomaticReconnect()
      .build();

    connection.start().catch(err => console.error("SignalR Error: ", err));

    connection.on("ReceiveComment", () => fetchComments());

    return () => connection.stop();
  }, [page, sortBy, isDesc]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setIsDesc(!isDesc);
    } else {
      setSortBy(field);
      setIsDesc(true);
    }
    setPage(1);
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: '800px' }}>

      <CommentForm 
        parentId={replyTo?.id} 
        parentName={replyTo?.name} 
        onCancelReply={() => setReplyTo(null)}
        onSuccess={() => { setReplyTo(null); fetchComments(); }}
      />

      <SortingPanel sortBy={sortBy} isDesc={isDesc} toggleSort={toggleSort} />

      <CommentsList 
        comments={comments} 
        onReply={(id, name) => {
          setReplyTo({id, name});
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      <Pagination page={page} totalCount={totalCount} setPage={setPage} />
    </div>
  );
}

export default App;

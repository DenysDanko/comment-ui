import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import CommentItem from './components/CommentItem';
import CommentForm from './components/CommentForm';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_URL = "https://localhost:7235/api/comments";

function App() {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null); // { id, name }
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchComments = async () => {
    const response = await axios.get(`${API_URL}?page=${page}&sortBy=date&desc=true`);
    setComments(response.data.items);
    setTotalCount(response.data.totalCount);
  };

  useEffect(() => {
    fetchComments();

    // SIGNALR: Підключення до хабу
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7235/commentHub")
      .withAutomaticReconnect()
      .build();

    connection.start().catch(err => console.error("SignalR Error: ", err));

    connection.on("ReceiveComment", (newComment) => {
      if (!newComment.parentId && page === 1) {
          fetchComments();
      } else if (newComment.parentId) {
          fetchComments();
      }
    });

    return () => connection.stop();
  }, [page]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">SPA Comments System</h1>
      
      <CommentForm 
        parentId={replyTo?.id} 
        parentName={replyTo?.name} 
        onCancelReply={() => setReplyTo(null)}
        onSuccess={() => {
            setReplyTo(null);
            fetchComments();
        }}
      />

      <div className="comment-list">
        {comments.map(c => (
          <CommentItem 
            key={c.id} 
            comment={c} 
            onReply={(id, name) => {
                setReplyTo({ id, name });
                window.scrollTo(0, 0); 
            }} 
          />
        ))}
      </div>

      {/* Пагінація */}
      <div className="mt-4 pb-5 d-flex justify-content-center align-items-center">
        <button
          className="btn btn-outline-primary me-3"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <i className="bi bi-arrow-left-circle"></i>
        </button>

        <span className="fw-bold">Page {page}</span>

        <button
          className="btn btn-outline-primary ms-3"
          disabled={page * 25 >= totalCount}
          onClick={() => setPage(page + 1)}
        >
          <i className="bi bi-arrow-right-circle"></i>
        </button>
      </div>
    </div>
  );
}

export default App;
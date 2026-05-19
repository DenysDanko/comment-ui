import React from 'react';
import CommentItem from './CommentItem';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function CommentsList({ comments, onReply }) {
  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-chat-dots fs-1 mb-3"></i>
          <div>No comments yet. Be the first!</div>
        </div>
      ) : (
        comments.map(c => (
          <CommentItem 
            key={c.id} 
            comment={c} 
            onReply={onReply} 
          />
        ))
      )}
    </div>
  );
}

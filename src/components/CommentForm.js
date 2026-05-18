import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CommentForm = ({ parentId, parentName, onCancelReply, onSuccess }) => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    homePage: '',
    content: '',
    captchaAnswer: ''
  });
  const [file, setFile] = useState(null);
  const [captcha, setCaptcha] = useState({ id: '', image: '' });
  const [preview, setPreview] = useState(false);
  const textAreaRef = useRef(null);

  const fetchCaptcha = async () => {
    const res = await axios.get("https://localhost:7235/api/captcha");
    setCaptcha({ id: res.data.captchaId, image: res.data.captchaImage });
  };

  useEffect(() => { fetchCaptcha(); }, []);

  const insertTag = (tag) => {
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const text = formData.content;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);

    let newText = "";
    if (tag === 'a') {
        newText = `${before}<a href="" title="">${selected}</a>${after}`;
    } else {
        newText = `${before}<${tag}>${selected}</${tag}>${after}`;
    }
    
    setFormData({ ...formData, content: newText });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("UserName", formData.userName);
    data.append("Email", formData.email);
    data.append("HomePage", formData.homePage);
    data.append("Content", formData.content);
    data.append("CaptchaId", captcha.id);
    data.append("CaptchaAnswer", formData.captchaAnswer);
    if (parentId) data.append("ParentId", parentId);
    if (file) data.append("File", file);

    try {
      await axios.post("https://localhost:7235/api/comments", data);
      setFormData({ ...formData, content: '', captchaAnswer: '' });
      setFile(null);
      fetchCaptcha();
      if (onSuccess) onSuccess();
    } catch (err) {
  console.error("Full error:", err.response?.data);

  const errorData = err.response?.data;

  if (errorData?.errors) {
    const messages = Object.values(errorData.errors).flat().join("\n");
    alert("Помилки валідації:\n" + messages);
  } else if (typeof errorData === 'string') {

    alert(errorData);
  } else {
    alert("Сталася невідома помилка. Перевірте консоль (F12).");
  }
      fetchCaptcha();
    }
  };

  return (
    <div className="card p-3 mb-4 shadow-sm">
      <h5>{parentId ? `Answer to ${parentName}` : "Leave a comment"}</h5>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input type="text" className="form-control" placeholder="User Name" required
              value={formData.userName} onChange={e => setFormData({...formData, userName: e.target.value})} />
          </div>
          <div className="col-md-4 mb-2">
            <input type="email" className="form-control" placeholder="Email" required
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="col-md-4 mb-2">
            <input type="url" className="form-control" placeholder="Home Page (URL)"
              value={formData.homePage} onChange={e => setFormData({...formData, homePage: e.target.value})} />
          </div>
        </div>

        <div className="mb-2">
          <div className="btn-group btn-group-sm mb-1">
            <button type="button" className="btn btn-outline-secondary" onClick={() => insertTag('strong')}>[strong]</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => insertTag('i')}>[i]</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => insertTag('code')}>[code]</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => insertTag('a')}>[a]</button>
          </div>
          <textarea ref={textAreaRef} className="form-control" rows="3" required
            value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
        </div>

        <div className="d-flex align-items-center mb-3">
          <img src={`data:image/png;base64,${captcha.image}`} alt="captcha" className="me-2" />
          <input type="text" className="form-control w-25" placeholder="Code" required
            value={formData.captchaAnswer} onChange={e => setFormData({...formData, captchaAnswer: e.target.value})} />
        </div>

        <div className="mb-3">
          <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} />
          <small className="text-muted">JPG, PNG, GIF</small>
        </div>

        <div className="d-flex justify-content-between">
          <div>
            <button type="submit" className="btn btn-primary me-2">Send</button>
            <button type="button" className="btn btn-secondary" onClick={() => setPreview(!preview)}>
                {preview ? "Hide preview" : "Preview"}
            </button>
          </div>
          {parentId && <button type="button" className="btn btn-danger" onClick={onCancelReply}>Cancel</button>}
        </div>
      </form>

      {preview && (
        <div className="mt-3 p-2 border bg-light">
          <h6>Preview</h6>
          <div dangerouslySetInnerHTML={{ __html: formData.content }} />
        </div>
      )}
    </div>
  );
}

export default CommentForm;
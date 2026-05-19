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
  const [errors, setErrors] = useState({});
  const textAreaRef = useRef(null);

  const API_BASE = "https://localhost:7235/api";

  const fetchCaptcha = async () => {
    try {
      const res = await axios.get(`${API_BASE}/captcha`);
      setCaptcha({ id: res.data.captchaId, image: res.data.captchaImage });
    } catch (err) {
      console.error("Failed to fetch captcha");
    }
  };

  useEffect(() => { fetchCaptcha(); }, []);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'User Name is required.';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.userName)) {
      newErrors.userName =
        'Only Latin letters, numbers and spaces are allowed.';
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (formData.homePage && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.homePage)) {
      newErrors.homePage = "Invalid URL format.";
    }

    if (!formData.captchaAnswer.trim()) {
      newErrors.captchaAnswer = "Captcha code is required.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Message content is required.";
    } else {
      const allowedTags = ['a', 'code', 'i', 'strong'];
      const tagRegex = /<(?!\/?(a|code|i|strong)(?=>|\s.*>))\/?.*?>/g;
      if (tagRegex.test(formData.content)) {
        newErrors.content = "Only <a>, <code>, <i>, and <strong> tags are allowed.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const insertTag = (tag) => {
    const { selectionStart, selectionEnd } = textAreaRef.current;
    const text = formData.content;
    const before = text.substring(0, selectionStart);
    const after = text.substring(selectionEnd);
    const selected = text.substring(selectionStart, selectionEnd);

    const taggedText = tag === 'a' 
      ? `<a href="" title="">${selected}</a>` 
      : `<${tag}>${selected}</${tag}>`;
    
    setFormData({ ...formData, content: before + taggedText + after });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

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
      await axios.post(`${API_BASE}/comments`, data);
      setFormData({ ...formData, content: '', captchaAnswer: '' });
      setFile(null);
      setErrors({});
      fetchCaptcha();
      if (onSuccess) onSuccess();
    } catch (err) {
      const serverErrors = err.response?.data;
      if (typeof serverErrors === 'string') {
        alert(serverErrors);
      } else if (serverErrors?.errors) {
        const msg = Object.values(serverErrors.errors).flat().join("\n");
        alert("Validation Error:\n" + msg);
      }
      fetchCaptcha();
    }
  };

  return (
    <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
      <h5 className="fw-bold mb-3 text-center text-dark">
        {parentId ? (
          <>
            Reply to{' '}
            <span className="badge bg-secondary fs-6 px-3 py-2">
              {parentName}
            </span>
          </>
        ) : (
          'Leave Your Comment'
        )}
      </h5>
      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input 
              type="text" 
              className={`form-control ${errors.userName ? 'is-invalid' : ''}`} 
              placeholder="User Name" 
              value={formData.userName} 
              onChange={e => setFormData({...formData, userName: e.target.value})} 
            />
            {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
          </div>
          <div className="col-md-4 mb-2">
            <input 
              type="email" 
              className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
              placeholder="Email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="col-md-4 mb-2">
            <input 
              type="url" 
              className={`form-control ${errors.homePage ? 'is-invalid' : ''}`} 
              placeholder="Home page (URL)" 
              value={formData.homePage} 
              onChange={e => setFormData({...formData, homePage: e.target.value})} 
            />
            {errors.homePage && <div className="invalid-feedback">{errors.homePage}</div>}
          </div>
        </div>

        <div className="mb-2">
          <div className="btn-group btn-group-sm mb-2">
            <button type="button" className="btn btn-outline-secondary me-2 shadow-sm" title="Bold" onClick={() => insertTag('strong')}>[strong]</button>
            <button type="button" className="btn btn-outline-secondary me-2 shadow-sm" title="Italic" onClick={() => insertTag('i')}>[i]</button>
            <button type="button" className="btn btn-outline-secondary me-2 shadow-sm" title="Code" onClick={() => insertTag('code')}>[code]</button>
            <button type="button" className="btn btn-outline-secondary me-2 shadow-sm" title="Link" onClick={() => insertTag('a')}>[a]</button>
          </div>
          <textarea 
            ref={textAreaRef} 
            className={`form-control ${errors.content ? 'is-invalid' : ''}`} 
            rows="4" 
            placeholder="Write your message..."
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})}
          ></textarea>
          {errors.content && <div className="invalid-feedback">{errors.content}</div>}
        </div>

        <div className="d-flex align-items-center mb-3">
          <div className="me-2">
            <img 
              src={`data:image/png;base64,${captcha.image}`} 
              alt="captcha" 
              className="border rounded bg-white" 
              style={{ height: '38px' }} 
            />
          </div>
          <div className="flex-grow-0">
            <input 
              type="text" 
              className={`form-control ${errors.captchaAnswer ? 'is-invalid' : ''}`} 
              placeholder="Code" 
              style={{ width: '120px' }}
              value={formData.captchaAnswer} 
              onChange={e => setFormData({...formData, captchaAnswer: e.target.value})} 
            />
          </div>
          {errors.captchaAnswer && <div className="ms-2 text-danger small">{errors.captchaAnswer}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Attachment:</label>
          <input type="file" className="form-control form-control-sm" onChange={e => setFile(e.target.files[0])} />
          <div className="form-text">Allowed: JPG, PNG, GIF, TXT (max 100kb).</div>
        </div>

        <div className="d-flex justify-content-between">
          <div>
            <button type="submit" className="btn btn-outline-secondary px-4 me-2 shadow-sm">
              <i className="bi bi-send"></i> Send
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setPreview(!preview)}>
                <i className={`bi ${preview ? 'bi-eye-slash-fill' : 'bi-eye-fill' }`}></i> Preview
            </button>
          </div>
          {parentId && (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelReply}>
              <i className="bi bi-x-circle"></i> Cancel
            </button>
          )}
        </div>
      </form>

      {preview && formData.content && (
        <div className="mt-3 p-3 border rounded bg-white shadow-sm">
          <h6 className="fw-bold text-muted border-bottom pb-2">Live Preview:</h6>
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: formData.content }} />
        </div>
      )}
    </div>
  );
}

export default CommentForm;
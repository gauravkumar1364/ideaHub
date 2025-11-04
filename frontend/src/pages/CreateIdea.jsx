import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function CreateIdea(){
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'Tech',
    description: '',
    problemStatement: '',
    solutionOverview: '',
    targetAudience: '',
    impact: '',
    tags: '',
    isDraft: false
  })

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(!stored) return navigate('/login')
    setUser(JSON.parse(stored))
    
    const saved = localStorage.getItem('ideaDraft')
    if(saved) {
      const draft = JSON.parse(saved)
      // Validate category is one of the allowed values
      const validCategories = ['Tech', 'Health', 'Sustainability', 'Education', 'Finance', 'Other']
      if (!validCategories.includes(draft.category)) {
        draft.category = 'Tech'
      }
      setForm(draft)
    }
  }, [])

  function handleChange(e){
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    setForm(updated)
    autosave(updated)
  }

  async function autosave(data){
    localStorage.setItem('ideaDraft', JSON.stringify(data))
  }

  async function submit(){
    if(!form.title || !form.description) return alert('Please fill required fields')
    
    setSaving(true)
    try{
      const token = localStorage.getItem('token')
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t)
      
      const res = await axios.post(API + '/posts', {
        title: form.title,
        description: form.description,
        category: form.category,
        problemStatement: form.problemStatement,
        solutionOverview: form.solutionOverview,
        targetAudience: form.targetAudience,
        impact: form.impact,
        tags: tagsArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      localStorage.removeItem('ideaDraft')
      navigate(`/idea/${res.data._id}`)
    }catch(e){
      console.error('Submit error:', e)
      alert('Failed to post idea: ' + (e.response?.data?.message || e.message))
    }finally{
      setSaving(false)
    }
  }

  return (
    <div className="create-idea-page">
      <div style={{maxWidth: '600px', margin: '0 auto', padding: '20px'}}>
        <h1>Share Your Idea</h1>
        
        <div className="step-header">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: (step / 4 * 100) + '%'}}></div>
          </div>
          <p className="step-info">Step {step} of 4</p>
        </div>

        <form>
          {step === 1 && (
            <div>
              <div className="form-group">
                <label>Idea Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Your idea in one line..." maxLength="100" />
                <small>{form.title.length}/100</small>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>Tech</option>
                  <option>Health</option>
                  <option>Sustainability</option>
                  <option>Education</option>
                  <option>Finance</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your idea..." maxLength="500"></textarea>
                <small>{form.description.length}/500</small>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="form-group">
                <label>Problem Statement</label>
                <textarea name="problemStatement" value={form.problemStatement} onChange={handleChange} placeholder="What problem does this solve?"></textarea>
              </div>
              <div className="form-group">
                <label>Solution Overview</label>
                <textarea name="solutionOverview" value={form.solutionOverview} onChange={handleChange} placeholder="How does your idea solve it?"></textarea>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="form-group">
                <label>Target Audience</label>
                <input type="text" name="targetAudience" value={form.targetAudience} onChange={handleChange} placeholder="Who will benefit from this?" />
              </div>
              <div className="form-group">
                <label>Expected Impact</label>
                <textarea name="impact" value={form.impact} onChange={handleChange} placeholder="What positive impact will this have?"></textarea>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="innovation, startup, ideas..." />
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">
                Back
              </button>
            )}
            {step < 4 && (
              <button type="button" onClick={() => setStep(step + 1)} className="btn-primary">
                Next
              </button>
            )}
            {step === 4 && (
              <button type="button" onClick={submit} disabled={saving || !form.title || !form.description} className="btn-primary">
                {saving ? 'Publishing...' : 'Publish Idea'}
              </button>
            )}
          </div>
        </form>

        <small style={{display: 'block', marginTop: '20px', color: '#999', textAlign: 'center'}}>
          Your draft is automatically saved. You can come back anytime!
        </small>
      </div>
    </div>
  )
}

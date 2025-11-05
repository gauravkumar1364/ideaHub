import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { API } from '../utils/api'
import {
	FiUser,
	FiLock,
	FiShield,
	FiSettings,
	FiLogOut,
	FiCamera,
	FiTrash2
} from 'react-icons/fi'

export default function Settings(){
	const navigate = useNavigate()
	const outletContext = useOutletContext()
	const globalSetUser = outletContext?.setUser
	const [tab, setTab] = useState('profile')
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [form, setForm] = useState({
		name: '',
		username: '',
		bio: '',
		department: '',
		batch: '',
		profilePicture: null
	})
	const [passwords, setPasswords] = useState({
		current: '',
		new: '',
		confirm: ''
	})
	const [avatarError, setAvatarError] = useState('')
	const fileInputRef = useRef(null)

	useEffect(() => {
		const stored = localStorage.getItem('user')
		if(!stored){
			navigate('/login')
			return
		}
		fetchUserDetails()
	}, [])

	async function fetchUserDetails(){
		try{
			const token = localStorage.getItem('token')
			const res = await axios.get(API + '/users/profile/me', {
				headers: { Authorization: `Bearer ${token}` }
			})
			setForm({
				name: res.data.name || res.data.username || '',
				username: res.data.username || '',
				bio: res.data.bio || '',
				department: res.data.department || '',
				batch: res.data.batch || '',
				profilePicture: res.data.profilePicture || null
			})
		}catch(e){
			console.error('Failed to load user details')
		}finally{
			setLoading(false)
		}
	}

	function triggerFilePicker(){
		fileInputRef.current?.click()
	}

	function handleAvatarChange(event){
		const file = event.target.files?.[0]
		if(!file) return
		if(!file.type.startsWith('image/')){
			setAvatarError('Please choose an image file (JPG, PNG, GIF).')
			event.target.value = ''
			return
		}
		const maxSize = 2 * 1024 * 1024
		if(file.size > maxSize){
			setAvatarError('Image must be 2 MB or smaller.')
			event.target.value = ''
			return
		}
		const reader = new FileReader()
		reader.onloadend = () => {
			setForm(prev => ({ ...prev, profilePicture: reader.result }))
			setAvatarError('')
		}
		reader.readAsDataURL(file)
		event.target.value = ''
	}

	function handleAvatarRemove(){
		setForm(prev => ({ ...prev, profilePicture: null }))
		setAvatarError('')
		if(fileInputRef.current) fileInputRef.current.value = ''
	}

	async function saveProfile(){
		setSaving(true)
		try{
			const token = localStorage.getItem('token')
			const payload = {
				name: form.name,
				bio: form.bio,
				department: form.department,
				batch: form.batch,
				profilePicture: form.profilePicture
			}
			const res = await axios.post(API + '/users/profile/update', payload, {
				headers: { Authorization: `Bearer ${token}` }
			})
			localStorage.setItem('user', JSON.stringify(res.data))
			globalSetUser?.(res.data)
			setForm(prev => ({
				...prev,
				profilePicture: res.data.profilePicture || null,
				name: res.data.name || prev.name,
				username: res.data.username || prev.username
			}))
			alert('Profile updated successfully!')
		}catch(e){
			alert('Failed to update profile: ' + (e.response?.data?.message || 'Unknown error'))
		}finally{
			setSaving(false)
		}
	}

	async function changePassword(){
		if(passwords.new !== passwords.confirm){
			alert("Passwords don't match!")
			return
		}
		if(passwords.new.length < 6){
			alert('Password must be at least 6 characters')
			return
		}

		setSaving(true)
		try{
			const token = localStorage.getItem('token')
			await axios.post(API + '/users/change-password', {
				currentPassword: passwords.current,
				newPassword: passwords.new
			}, {
				headers: { Authorization: `Bearer ${token}` }
			})
			alert('Password changed successfully!')
			setPasswords({ current: '', new: '', confirm: '' })
		}catch(e){
			alert('Failed to change password: ' + (e.response?.data?.message || 'Unknown error'))
		}finally{
			setSaving(false)
		}
	}

	function logout(){
		if(window.confirm('Are you sure you want to log out?')){
			localStorage.removeItem('token')
			localStorage.removeItem('user')
			navigate('/login')
		}
	}

	if(loading) return <div className="loading-state">Loading settings...</div>

	return (
		<div className="settings-page">
			<div className="page-shell settings-shell">
				<header className="page-header">
					<div>
						<h1>Settings & account</h1>
						<p className="page-subtitle">Tune your profile, security, and preferences for ideaHub.</p>
					</div>
				</header>

				<nav className="settings-tabs">
					<button onClick={() => setTab('profile')} className={tab === 'profile' ? 'active' : ''}>
						<FiUser aria-hidden="true" />
						<span>Profile</span>
					</button>
					<button onClick={() => setTab('password')} className={tab === 'password' ? 'active' : ''}>
						<FiLock aria-hidden="true" />
						<span>Password</span>
					</button>
					<button onClick={() => setTab('privacy')} className={tab === 'privacy' ? 'active' : ''}>
						<FiShield aria-hidden="true" />
						<span>Privacy</span>
					</button>
					<button onClick={() => setTab('account')} className={tab === 'account' ? 'active' : ''}>
						<FiSettings aria-hidden="true" />
						<span>Account</span>
					</button>
				</nav>

				{tab === 'profile' && (
					<section className="settings-content card">
						<header className="settings-section-header">
							<h2>Profile details</h2>
							<p>Update how others see you across the community.</p>
						</header>

						<div className="settings-avatar-row">
							<div className="settings-avatar-preview">
								{form.profilePicture ? (
									<img src={form.profilePicture} alt="Profile avatar preview" className="avatar-image" />
								) : (
									<span>{form.name?.[0]?.toUpperCase() || 'U'}</span>
								)}
							</div>
							<div className="settings-avatar-actions">
								<button type="button" className="btn-secondary" onClick={triggerFilePicker}>
									<FiCamera aria-hidden="true" />
									<span>Change photo</span>
								</button>
								{form.profilePicture && (
									<button type="button" className="btn-tertiary" onClick={handleAvatarRemove}>
										<FiTrash2 aria-hidden="true" />
										<span>Remove</span>
									</button>
								)}
								<p className="input-help">JPG or PNG up to 2 MB.</p>
								{avatarError && <p className="input-error">{avatarError}</p>}
							</div>
							<input
								type="file"
								ref={fileInputRef}
								accept="image/*"
								onChange={handleAvatarChange}
								className="sr-only"
							/>
						</div>

						<div className="form-grid">
							<div className="form-group">
								<label>Full name</label>
								<input 
									value={form.name}
									onChange={(e) => setForm({...form, name: e.target.value})}
									placeholder="Your name"
								/>
							</div>
							<div className="form-group">
								<label>Username</label>
								<input 
									value={form.username}
									disabled
								/>
								<p className="input-help">Usernames are unique and used for login.</p>
							</div>
							<div className="form-group">
								<label>Department</label>
								<input 
									value={form.department}
									onChange={(e) => setForm({...form, department: e.target.value})}
									placeholder="e.g., Computer Science"
								/>
							</div>
							<div className="form-group span-2">
								<label>Bio</label>
								<textarea 
									value={form.bio}
									onChange={(e) => setForm({...form, bio: e.target.value})}
									placeholder="Tell us about yourself..."
									rows={3}
								/>
							</div>
							<div className="form-group">
								<label>Graduation year</label>
								<input 
									value={form.batch}
									onChange={(e) => setForm({...form, batch: e.target.value})}
									placeholder="e.g., 2025"
								/>
							</div>
						</div>

						<div className="settings-actions">
							<button onClick={saveProfile} disabled={saving} className="btn-primary">
								{saving ? 'Saving...' : 'Save changes'}
							</button>
						</div>
					</section>
				)}

				{tab === 'password' && (
					<section className="settings-content card">
						<header className="settings-section-header">
							<h2>Change password</h2>
							<p>Keep your account secure with a strong password.</p>
						</header>

						<div className="info-banner warning">
							For security, choose a password with letters, numbers, and special characters.
						</div>

						<div className="form-group">
							<label>Current password</label>
							<input 
								type="password"
								value={passwords.current}
								onChange={(e) => setPasswords({...passwords, current: e.target.value})}
								placeholder="Enter your current password"
							/>
						</div>
						<div className="form-group">
							<label>New password</label>
							<input 
								type="password"
								value={passwords.new}
								onChange={(e) => setPasswords({...passwords, new: e.target.value})}
								placeholder="Enter a new password"
							/>
						</div>
						<div className="form-group">
							<label>Confirm password</label>
							<input 
								type="password"
								value={passwords.confirm}
								onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
								placeholder="Re-enter new password"
							/>
						</div>

						<div className="settings-actions">
							<button onClick={changePassword} disabled={saving} className="btn-primary">
								{saving ? 'Updating...' : 'Change password'}
							</button>
						</div>
					</section>
				)}

				{tab === 'privacy' && (
					<section className="settings-content card">
						<header className="settings-section-header">
							<h2>Privacy & security</h2>
							<p>Control who can see your activity and how we contact you.</p>
						</header>

						<div className="setting-item">
							<div>
								<h4>Public profile</h4>
								<p>Allow others to view your profile and published ideas.</p>
							</div>
							<label className="toggle">
								<input type="checkbox" defaultChecked />
								<span className="toggle-slider"></span>
							</label>
						</div>

						<div className="setting-item">
							<div>
								<h4>Email notifications</h4>
								<p>Get email updates for new follows, comments, and upvotes.</p>
							</div>
							<label className="toggle">
								<input type="checkbox" defaultChecked />
								<span className="toggle-slider"></span>
							</label>
						</div>

						<div className="setting-item">
							<div>
								<h4>Show email to others</h4>
								<p>Let other users reach out to you directly via email.</p>
							</div>
							<label className="toggle">
								<input type="checkbox" />
								<span className="toggle-slider"></span>
							</label>
						</div>

						<div className="setting-item">
							<div>
								<h4>Two-factor authentication</h4>
								<p>Extra verification for sign-in (coming soon).</p>
							</div>
							<button className="btn-secondary" disabled>
								Enable
							</button>
						</div>
					</section>
				)}

				{tab === 'account' && (
					<section className="settings-content card">
						<header className="settings-section-header">
							<h2>Account management</h2>
							<p>Download your data or close your account.</p>
						</header>

						<div className="danger-zone">
							<div className="danger-item">
								<div>
									<h4>Download your data</h4>
									<p>Get a copy of everything you have shared. Coming soon.</p>
								</div>
								<button className="btn-secondary" disabled>Download</button>
							</div>

							<div className="danger-item">
								<div>
									<h4>Deactivate account</h4>
									<p>Temporarily disable your account. You can reactivate later.</p>
								</div>
								<button className="btn-warning">Deactivate</button>
							</div>

							<div className="danger-item">
								<div>
									<h4>Delete account</h4>
									<p>This action cannot be undone. All your data will be removed.</p>
								</div>
								<button className="btn-danger">Delete permanently</button>
							</div>
						</div>

						<div className="settings-actions">
							<button onClick={logout} className="btn-secondary full-width">
								<FiLogOut aria-hidden="true" />
								<span>Logout</span>
							</button>
						</div>
					</section>
				)}
			</div>
		</div>
	)
}


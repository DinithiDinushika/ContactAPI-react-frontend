import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom';
import { getContact, updatePhoto } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/ToastService';

const ContactDetail = ({ updateContact, updateImage }) => {
    const inputRef = useRef();
    const [contact, setContact] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '', 
        photoUrl:''
    
    });

    //this gets the id from the Url
    const { id } = useParams();
    console.log(id)

    const fetchContact = async (id) => {
        try{
            //here, from the response, it destructures the data
            const {data} = await getContact(id);
            setContact(data);
            console.log(data);
            //toastSuccess('Contacts Retrieved');
        }catch(error){
            console.log(error);
            toastError(error.message);
        }
    };

    const selectImage = () => {
        inputRef.current.click();
    };

    const updatePhoto = async (file) =>{
        try{
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('id', id);
            await updateImage(formData);
            setContact((prev) => ({...prev, photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`})); 
            //...prev says that need all contact data as previous and only photoUrl will be changed. everytime we update the photo , photoUrl will be changed
            toastSuccess('Photo Updated');
        }catch(error){
            console.log(error);
            toastError(error.message)
        }

    };

    const onChange = (event) => {
        setContact({ ...contact, [event.target.name]: event.target.value});
        //console.log(contact);
    };

    const onUpdateContact = async (event) => {
        event.preventDefault();
        await updateContact(contact);
        fetchContact(id);
        toastSuccess('contact Updated');
    };

    useEffect(() => {
        fetchContact(id);
    }, []);

  return (
    <>
    <Link to={'/contacts'} className='link'><i className='bi bi-arrow-left'></i>Back to list</Link>
    <div className="profile">
        <div className="profile__details">
            <img src={contact.photoUrl} alt={`Profile photo of ${contact.name}`} />
            <div className="profile__metadata">
                <p className='profile__name'>{contact.name}</p>
                <p className='profile__muted'>JPG, GIF, or PNG. Max size of 10MB</p>
                <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i>Change Photo</button>
            </div>
        </div>
        <div className="profile__settings">
            <div>
                <form onSubmit={onUpdateContact} className='form'>
                    <div className="user-details">
                        {/* If we don't pass this id here, backend thinks it is for create a new contact. So to update the data we need to pass id */}
                        <input type="hidden" defaultValue={contact.id} name='id' required />
                        <div className="input-box">
                            <span className='details'>Name</span>
                            <input type="text" value={contact.name} onChange={onChange} name='name' required />
                        </div>
                        <div className="input-box">
                            <span className='details'>Email</span>
                            <input type="text" value={contact.email} onChange={onChange} name='email' required />
                        </div>
                        <div className="input-box">
                            <span className='details'>Phone</span>
                            <input type="text" value={contact.phone} onChange={onChange} name='phone' required />
                        </div>
                        <div className="input-box">
                            <span className='details'>Address</span>
                            <input type="text" value={contact.address} onChange={onChange} name='address' required />
                        </div>
                        <div className="input-box">
                            <span className='details'>Title</span>
                            <input type="text" value={contact.title} onChange={onChange} name='title' required />
                        </div>
                        <div className="input-box">
                            <span className='details'>Status</span>
                            <input type="text" value={contact.status} onChange={onChange} name='status' required />
                        </div>
                    </div>
                    <div className="form_footer">
                        <button type='submit' className='btn'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <form style={{display: 'none'}}>
        <input type="file" ref={inputRef} onChange={(event) => updatePhoto(event.target.files[0])} name='file' accept='image/*'/>
    </form>
    </>
  )
}

export default ContactDetail
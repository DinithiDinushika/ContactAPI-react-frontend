import { useEffect, useRef, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { getContacts, saveContact, updatePhoto } from './api/ContactService';
import Header from './components/Header';
import { Routes, Route, Navigate } from 'react-router-dom';
import ContactList from './components/ContactList';
import ContactDetail from './components/ContactDetail';
import { toastError } from './api/ToastService';
import { ToastContainer } from 'react-toastify';

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',  

  });

  
  const getAllContacts = async (page=0, size = 10) =>{
    try{
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
      console.log(data)
    } catch (error){
      console.log(error);
      toastError(error.message);
      //fileRef.current.value = null;
    }
  }

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value});
    //console.log(values);
  };

  const handleNewcontact = async (event) => {
    //this prevents the web page from refreshing (default submission behavior)
    event.preventDefault();
    try{
      //here, from the response, it destructures the data
      const {data} = await saveContact(values);
      //console.log(data);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', data.id);
      const { data: photoUrl} = await updatePhoto(formData);
      toggleModal(false); //close the dialog after saving contact
      console.log(photoUrl);
      //this removes the image we previously selected when create a contact
      setFile(undefined);
      fileRef.current.value = null;
      //resetting form values
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '', 
      })
      getAllContacts();

    }catch(error){
      console.log(error);
      toastError(error.message);
    }
  };

  const updateContact = async (contact) =>{
    try{
      const { data } = await saveContact(contact);
      console.log(data);

    }catch(error){
      console.log(error);
      toastError(error.message);
    }
    
  }

  const updateImage = async (formData) =>{
    try{
      const { data: photoUrl} = await updatePhoto(formData);

    }catch(error){
      console.log(error);
      toastError(error.message);
    }
  };

  //If show is true, then it shows the html popup (dialog) that refereces modalRef
  const toggleModal = show => show ? modalRef.current.showModal() : modalRef.current.close();

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
      <main className='main'>
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={'/contacts'}/>}/>
            <Route path="/contacts" element={ <ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts}/>}/>
            <Route path="/contacts/:id" element={ <ContactDetail updateContact={updateContact} updateImage ={updateImage} />}/>
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className='modal' id='modal'>
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className='bi bi-x-lg'></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewcontact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={values.name} onChange={onChange} name="name" required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="text" value={values.email} onChange={onChange} name="email" required />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" value={values.title} onChange={onChange} name="title" required />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input type="text" value={values.phone} onChange={onChange} name="phone" required />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" value={values.address} onChange={onChange} name="address" required />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input type="text" value={values.status} onChange={onChange} name="status" required />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input type="file" onChange={(event) => {setFile(event.target.files[0]); console.log(event.target.files[0])}} ref={fileRef} name="photo" required />
                {/* here this console.log is use to check whether the file has been set */}
              </div>
            </div>
            <div className="form_footer">
              <button onClick={() => toggleModal(false)} type='button' className='btn btn-danger'>Cancel</button>
              <button type='submit' className='btn'>Save</button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer/>
    </>
  );
}

export default App;
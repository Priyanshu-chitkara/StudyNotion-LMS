import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import API from '../services/api';
import Navbar from '../components/Navbar';

function EditCourse() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
  });

  const [image, setImage] = useState(null);

  const [video, setVideo] = useState(null);

  // ================= FETCH COURSE =================
  const fetchCourse = async () => {

    try {

      const res = await API.get(`/course/${id}`);

      const course = res.data.course;

      setForm({
        title: course.title,
        description: course.description,
        price: course.price,
      });

    } catch (err) {

      toast.error('Failed to fetch course ❌');
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE COURSE =================
  const handleUpdate = async () => {

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('price', form.price);

      if (image) {

        formData.append('image', image);
      }

      if (video) {

        formData.append('video', video);
      }

      await API.put(
        `/course/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      toast.success('Course updated 🚀');

      navigate(`/course/${id}`);

    } catch (err) {

      toast.error(
        err?.response?.data?.message ||
        'Update failed ❌'
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= UI =================
  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">

      <Navbar />

      <div className="flex justify-center items-center p-6">

        <div className="bg-white shadow-2xl rounded-[35px] p-8 w-full max-w-2xl">

          <h1 className="text-5xl font-black mb-8 text-center">
            ✏️ Edit Course
          </h1>

          {/* TITLE */}
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="w-full border p-4 rounded-2xl mb-5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* DESCRIPTION */}
          <textarea
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Course Description"
            className="w-full border p-4 rounded-2xl mb-5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Course Price"
            className="w-full border p-4 rounded-2xl mb-5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* IMAGE */}
          <div className="mb-5">

            <label className="font-bold block mb-2">
              Upload Thumbnail
            </label>

            <input
              type="file"
              onChange={(e) =>
                setImage(e.target.files[0])
              }
            />

          </div>

          {/* VIDEO */}
          <div className="mb-8">

            <label className="font-bold block mb-2">
              Upload Demo Video
            </label>

            <input
              type="file"
              onChange={(e) =>
                setVideo(e.target.files[0])
              }
            />

          </div>

          {/* BUTTON */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-5 rounded-2xl text-xl font-black hover:scale-[1.01] transition duration-300 shadow-xl"
          >

            {loading
              ? 'Updating...'
              : 'Update Course 🚀'}

          </button>

        </div>

      </div>

    </div>
  );
}

export default EditCourse;
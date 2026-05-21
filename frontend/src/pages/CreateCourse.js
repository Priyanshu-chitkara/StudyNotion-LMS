import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import API from '../services/api';
import Navbar from '../components/Navbar';

function CreateCourse() {

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
  });

  const [image, setImage] = useState(null);

  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    try {

      setLoading(true);

      const formData = new FormData();

      // TEXT FIELDS
      formData.append('title', form.title);

      formData.append(
        'description',
        form.description
      );

      formData.append(
        'price',
        form.price
      );

      // IMAGE FILE
      if (image) {

        formData.append(
          'image',
          image
        );
      }

      // VIDEO FILE
      if (video) {

        formData.append(
          'video',
          video
        );
      }

      console.log("FORM DATA:", formData);

      // ================= API CALL =================
      const response = await API.post(
        '/course/create',
        formData
      );

      console.log(response.data);

      // SUCCESS
      toast.success(
        'Course created successfully 🚀'
      );

      // REDIRECT
      setTimeout(() => {

        navigate('/courses');

      }, 1500);

    } catch (err) {

      console.log(
        'CREATE COURSE ERROR:',
        err
      );

      toast.error(
        err?.response?.data?.message ||
        'Creation failed ❌'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex justify-center items-center p-6">

        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">

          {/* TITLE */}
          <h2 className="text-3xl font-bold text-center mb-6">
            Create Course
          </h2>

          {/* COURSE TITLE */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="w-full border p-3 rounded mb-4 outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Course Description"
            rows="4"
            className="w-full border p-3 rounded mb-4 outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* PRICE */}
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Course Price"
            className="w-full border p-3 rounded mb-4 outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* IMAGE */}
          <label className="block mb-2 font-medium">
            Upload Thumbnail
          </label>

          <input
            type="file"
            accept="image/*"
            className="mb-4"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

          {/* IMAGE PREVIEW */}
          {image && (

            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full h-44 object-cover rounded mb-4"
            />

          )}

          {/* VIDEO */}
          <label className="block mb-2 font-medium">
            Upload Demo Video
          </label>

          <input
            type="file"
            accept="video/*"
            className="mb-4"
            onChange={(e) =>
              setVideo(e.target.files[0])
            }
          />

          {/* VIDEO PREVIEW */}
          {video && (

            <video
              controls
              className="w-full rounded mb-4"
            >

              <source
                src={URL.createObjectURL(video)}
              />

            </video>

          )}

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >

            {loading
              ? 'Creating Course...'
              : 'Create Course 🚀'}

          </button>

        </div>

      </div>

    </div>
  );
}

export default CreateCourse;
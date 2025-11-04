import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import LoaderWithBackground from "../components/LoaderWithBackground";
import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL } from "../api/urls";
import { useAuthStore } from "../store/auth/authStore";

const CourseStudy = () => {
  const [coursePdfCount, setCoursePdfCount] = useState<number>(0);
  const [courseVideoCount, setCourseVideoCount] = useState<number>(0);

  const [subjectDetails, setSubjectDetails] = useState<any>(null);

  const [coursePdfList, setCoursePdfList] = useState<any[]>([]);
  const [courseVideoList, setCourseVideoList] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { token, logout } = useAuthStore();

  // Track which video is playing (by index)
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Refs to video elements so we can control them programmatically
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetchCourseMaterials();
  }, []);

  const fetchCourseMaterials = async () => {
    setLoading(true);
    try {
      const resp = await postApi(
        APIPATH.studyMaterial,
        { subject_id: "1" },
        token,
        logout
      );
      const {
        success,
        subjectDetails,
        course_pdf_count,
        course_video_count,
        course_pdf,
        course_video,
      } = resp;

      if (success) {
        setSubjectDetails(subjectDetails?.[0] || null);
        setCoursePdfCount(course_pdf_count || 0);
        setCourseVideoCount(course_video_count || 0);
        setCoursePdfList(course_pdf || []);
        setCourseVideoList(course_video || []);
      }
    } catch (error) {
      console.error("Error fetching course materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayClick = (index: number) => {
    // Pause the currently playing video (if any)
    if (playingIndex !== null && playingIndex !== index) {
      const currentVideo = videoRefs.current[playingIndex];
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.controls = false;
      }
    }
    // Toggle play/pause for clicked video
    if (playingIndex === index) {
      // If clicking the same playing video, pause it
      const currentVideo = videoRefs.current[index];
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.controls = false;
      }
      setPlayingIndex(null);
    } else {
      // Play new video
      setPlayingIndex(index);
      const newVideo = videoRefs.current[index];
      if (newVideo) {
        newVideo.controls = true;
        newVideo.play();
      }
    }
  };

  // When playingIndex changes, update controls and play/pause states
  useEffect(() => {
    courseVideoList.forEach((_, idx) => {
      const video = videoRefs.current[idx];
      if (video) {
        if (idx === playingIndex) {
          video.controls = true;
          video.play().catch(() => {}); // catch play errors silently
        } else {
          video.pause();
          video.controls = false;
        }
      }
    });
  }, [playingIndex, courseVideoList]);

  return (
    <section>
      <LoaderWithBackground visible={loading} />

      <div className="course-study-top">
        <div className="container">
          <div className="course-study-top-align">
            <div>
              <h2 className="sub-heading mb-2">
                {subjectDetails?.course_name} JEE Nurture Online Course
              </h2>
              <p className="text mb-0 text-secondary">{subjectDetails?.subject_name}</p>
            </div>
            <Link to="/dashboard" className="back-to-dash-btn btn">
              <i className="fa-solid fa-house-chimney" /> Back
            </Link>
          </div>
        </div>
      </div>

      <div className="course-study-page">
        <div className="container">
          <ul
            className="courses-tabs course-study-tab bg-light mx-auto mb-4"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="Course-Video-tab"
                data-bs-toggle="pill"
                data-bs-target="#Course-Video"
                type="button"
                role="tab"
              >
                Video : {courseVideoCount}+
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="Course-PDF-tab"
                data-bs-toggle="pill"
                data-bs-target="#Course-PDF"
                type="button"
                role="tab"
              >
                PDF : {coursePdfCount}+
              </button>
            </li>
          </ul>

          <div className="tab-content" id="pills-tabContent">
            {/* Videos Tab */}
            <div
              className="tab-pane fade show active"
              id="Course-Video"
              role="tabpanel"
            >
              <div className="course-studylist-overflow">
                <div className="course-study-cards-align">
                  {courseVideoList.length === 0 && <p>No videos available.</p>}
                  {courseVideoList.map((video, i) => (
                    <div key={video.id || i} className="course-studyvideo-card">
                      <div className="course-video-align">
                        <video
                          ref={(el) => (videoRefs.current[i] = el)}
                          className="img-fluid d-block coursevideo"
                          poster={
                            video.thumbnail_image
                              ? `${IMAGE_URL}${video.thumbnail_image}`
                              : undefined
                          }
                          preload="metadata"
                          controls={playingIndex === i}
                          onEnded={() => setPlayingIndex(null)}
                        >
                          <source src={`${IMAGE_URL}${video.video}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {playingIndex !== i && (
                          <button
                            type="button"
                            className="cv-play-button"
                            onClick={() => handlePlayClick(i)}
                          >
                            <i className="fa-solid fa-circle-play" />
                          </button>
                        )}
                      </div>
                      <h4 className="coursestudy-title">{video.video_title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PDFs Tab */}
            <div className="tab-pane fade" id="Course-PDF" role="tabpanel">
              <div className="course-studylist-overflow">
                <div className="course-study-cards-align">
                  {coursePdfList.length === 0 && <p>No PDFs available.</p>}
                  {coursePdfList.map((pdf, i) => (
                    <div key={pdf.id || i} className="course-study-pdf-card">
                      <div className="pdf-studycard-top">
                        <i className={`fa-solid fa-file-pdf`} />
                        <h4 className="pdf-studycard-title">{pdf.title}</h4>
                      </div>
                      <div className="d-flex gap-3 align-items-center w-100 justify-content-between flex-wrap">
                        {i % 2 === 0 && (
                          <span className="pdf-read-badge">
                            <i className="fa-regular fa-circle-check" />
                          </span>
                        )}
                        <a
                          href={`${IMAGE_URL}${pdf.video || pdf.file_path || ""}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pdf-study-view-btn btn ms-auto"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add other tabs like Notes or Audio here if needed */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseStudy;

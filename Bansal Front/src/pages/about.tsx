
import './about.css';
import { useEffect, useRef, useState } from 'react';
import Slider from "react-slick";
// Slick slider settings for team members
const teamSliderSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
};

const sliderSettings2 = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: false,
    responsive: [
        { breakpoint: 1920, settings: { slidesToShow: 4 } },
        { breakpoint: 1400, settings: { slidesToShow: 3 } },
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 576, settings: { slidesToShow: 1 } },

    ],
    adaptiveHeight: false, // Ensures all slides have equal height
    // cssEase: 'linear'
};

import imgTeacher from '/assets/img/about/teacher.png';
import aboutBg from '/assets/img/about/aboutbg.png';
import frame1 from '/assets/img/about/Frame 163236.png';
import frame2 from '/assets/img/about/Frame 163236-1.png';
import frame3 from '/assets/img/about/Frame 163236-2.png';
import frame4 from '/assets/img/about/Frame 163236-3.png';
import ourGoals1 from '/assets/img/about/image (2).png';
import ourGoals2 from '/assets/img/about/image-1 (2).png';
import visionImg from '/assets/img/about/vision 1.png';
import missionImg from '/assets/img/about/mission 1.png';
// import partners1 from '/assets/img/about/Picture1 5.png';
// import partners2 from '/assets/img/about/Picture2 1.png';
// import partners3 from '/assets/img/about/Picture3 1.png';
// import partners4 from '/assets/img/about/Picture4 1.png';
// import partners5 from '/assets/img/about/Picture12 1.png';
// import partners6 from '/assets/img/about/Picture14 1.png';
import vissionImg from '/assets/img/about/vission.png';
import missionBgImg from '/assets/img/about/mission.png';
import { postApi } from '../services/services';
import { APIPATH, IMAGE_URL } from '../api/urls';
import { useAuthStore } from '../store/auth/authStore';
import { toast } from 'react-toastify';
import LoaderWithBackground from '../components/LoaderWithBackground';
import ReadMore from '../components/ReadMore';
// import Testimonials from '../components/testimonials';

const teamMembers = [
    {
        name: "Mr. Narendra Pandya",
        profession: "(CEO)",
        image: imgTeacher,
        about: `Technical Consultant | BE in Computer Science | 20+ years of IT experience Expert in Manufacturing ERP,system programming. Innovated software`,
    },
    {
        name: "Mrs. Harshada Gawade",
        profession: "Head: Finance and Admin",
        image: imgTeacher,
        about: `Technical Consultant | BE in Computer Science | 20+ years of IT experience Expert in Manufacturing ERP,system programming. Innovated software`,
    },
    {
        name: "Mr. Deevakar Jha",
        profession: "Head: Operations",
        image: imgTeacher,
        about: `Technical Consultant | BE in Computer Science | 20+ years of IT experience Expert in Manufacturing ERP,system programming. Innovated software `,
    },
];

const About = () => {
    const [loading, setLoading] = useState(false);
    const [aboutData, setAboutData] = useState<any>('');
    const [teacherData, setTeacherData] = useState<any>([]);
    // const [testimonialList, setTestimonialList] = useState<any>('');
    const { token, logout } = useAuthStore();
    const [expanded, setExpanded] = useState(Array(teamMembers.length).fill(false));
    // Track which team member needs a read more button
    const [needsReadMore, setNeedsReadMore] = useState(Array(teamMembers.length).fill(false));
    // Refs for each about-pera
    const aboutRefs = useRef<(HTMLParagraphElement | null)[]>([]);
 useEffect(() => {
        getAbout();
    }, []);
    const getAbout = () => {
        setLoading(true);
        postApi(APIPATH.about, {}, token, logout)
            .then((resp) => {
                const { success, data, message } = resp;
                if (success) {
                    setAboutData(data.aboutUs);
                    setTeacherData([data.teachers]);
                    // setTestimonialList([data.testimonials])
                } else {
                    toast.error(message);
                }
            })
            .catch((err) => {
                console.error("CMS Fetch Error:", err?.response?.data || err.message || err);
                toast.error("Failed to load content.");
            })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        // Check if about-pera height exceeds 143px
        const newNeedsReadMore = aboutRefs.current.map(ref => {
            if (ref) {
                return ref.scrollHeight >= 143;
            }
            return false;
        });
        setNeedsReadMore(newNeedsReadMore);
    }, []);

    const handleReadMore = (idx: number) => {
        setExpanded(prev => {
            const updated = [...prev];
            updated[idx] = !updated[idx];
            return updated;
        });
    };

    useEffect(() => {
        // Equalize height of .h-100-equal cards after slider renders
        const equalizeHeights = () => {
            const items = document.querySelectorAll('.h-100-equal');
            let maxHeight = 0;
            items.forEach(item => {
                (item as HTMLElement).style.height = 'auto';
                maxHeight = Math.max(maxHeight, (item as HTMLElement).offsetHeight);
            });
            items.forEach(item => {
                (item as HTMLElement).style.height = `${maxHeight}px`;
            });
        };

        // Run after mount and when window resizes
        setTimeout(equalizeHeights, 100); // Wait for slider to render
        window.addEventListener('resize', equalizeHeights);
        return () => window.removeEventListener('resize', equalizeHeights);
    }, []);
   
    return (
        <>
        <LoaderWithBackground visible = {loading} />
            <div className="about-page-body">
                <section>
                    <div className="about-page-hero" style={{ backgroundImage: `url(${aboutBg})` }}>
                        <div className="container">
                            <div className="about-hero-content">
                                <h2 className="heading text-primery w-fit-content mx-auto text-center">{aboutData.title}</h2>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: (aboutData?.description || "").slice(0, 450)
                                    }}
                                    className="text text-center text-white"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>


            <section className="overflow-hidden">
                <div className="why-choose-section">
                    <div className="container">
                        <div className="row align-items-center justify-content-between mb-4">
                            <div className="col-md-7 col-xl-6 mb-4" data-aos="fade-down-right">
                                <h2 className="heading mb-4">Why <span> Bansal Smart</span></h2>
                                <h3 className="why-choose-heading">Achieve Your Best with Dedicated Personal Guidance</h3>
                                {/* <p dangerouslySetInnerHTML={{ __html: (aboutData?.description || "").slice(0, 500) }} className="why-choose-content why-sm-cont">
                                </p> */}
                                 <ReadMore
                                    html={aboutData?.description || ""}
                                    className="why-choose-content why-sm-cont"
                                    maxLength={700}
                                />
                            </div>
                            <div className="col-md-5 col-xl-6 mb-4" data-aos="fade-down-left">
                                <img src="/assets/img/why-choose.png" alt="#" className="img-fluid" />
                            </div>
                        </div>
                        <div className="why-choose-bottom" data-aos="fade-up">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 mb-4 mb-lg-0">
                                    <div className="why-choose-bottom-card">
                                        <img src="/assets/img/live-stream.png" alt="#" className="img-fluid" />
                                        <h3 className="why-choose-bottom-title">Daily Live</h3>
                                        <p className="why-choose-bottom-pera">Interactive Sessions</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 mb-4 mb-lg-0">
                                    <div className="why-choose-bottom-card">
                                        <img src="/assets/img/contract.png" alt="#" className="img-fluid" />
                                        <h3 className="why-choose-bottom-title">10 Million +</h3>
                                        <p className="why-choose-bottom-pera">Tests, sample papers &amp; notes</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 mb-4 mb-sm-0">
                                    <div className="why-choose-bottom-card">
                                        <img src="/assets/img/question.png" alt="#" className="img-fluid" />
                                        <h3 className="why-choose-bottom-title">24 x 7</h3>
                                        <p className="why-choose-bottom-pera">Interactive Sessions</p>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <div className="why-choose-bottom-card">
                                        <img src="/assets/img/skyscraper.png" alt="#" className="img-fluid" />
                                        <h3 className="why-choose-bottom-title">100+</h3>
                                        <p className="why-choose-bottom-pera">Offline centers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="about-page-body">
                <section>
                    <div className="specifics-section">
                        <div className="container">
                            <h2 className="heading text-cente mb-4 text-center">Empowering Businesses with Innovative IT Solutions
                            </h2>
                            <div className="specifics-section-slider">
                                <Slider {...sliderSettings2} >
                                    <div className="item h-100-equal">
                                        <div className="specifics-section-card">
                                            <div className="specifics-card-icon">
                                                <img src={frame1} alt="#" className="img-fluid" />
                                            </div>
                                            <h3 className="specifics-card-title text-center">Customer-Centric Approach</h3>
                                            <p className="text text-center">Committed to exceeding expectations with outstanding services,
                                                flexibility, and value.</p>
                                        </div>
                                    </div>
                                    <div className="item h-100-equal">
                                        <div className="specifics-section-card">
                                            <div className="specifics-card-icon">
                                                <img src={frame2} alt="#" className="img-fluid" />
                                            </div>
                                            <h3 className="specifics-card-title text-center">Operational Excellence</h3>
                                            <p className="text text-center"> Optimizing system functionality and improving efficiency</p>
                                        </div>
                                    </div>
                                    <div className="item h-100-equal">
                                        <div className="specifics-section-card">
                                            <div className="specifics-card-icon">
                                                <img src={frame3} alt="#" className="img-fluid" />
                                            </div>
                                            <h3 className="specifics-card-title text-center">Expert Team</h3>
                                            <p className="text text-center">Skilled professionals with deep technical and functional
                                                expertise.</p>
                                        </div>
                                    </div>
                                    <div className="item h-100-equal">
                                        <div className="specifics-section-card">
                                            <div className="specifics-card-icon">
                                                <img src={frame4} alt="#" className="img-fluid" />
                                            </div>
                                            <h3 className="specifics-card-title text-center">Diverse Clientele</h3>
                                            <p className="text text-center"> Serving startups to large enterprises with tailored IT
                                                solutions.</p>
                                        </div>
                                    </div>
                                </Slider>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="our-goals-section" >
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6 mb-4">
                                    <div className="our-goals-card">
                                        <img src={ourGoals1} alt="#" className="our-goals-img img-fluid" />
                                        <div className="our-goals-content">
                                            <h3 className="our-golas-herading">Our Customers</h3>
                                            <p className="text mb-0">Our customers are companies of all sizes ranging from start-ups to
                                                large enterprises who realize that they need professional solutions to streamline
                                                business operations in a cost-effective manner and control the business process.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 mb-4">
                                    <div className="our-goals-card">
                                        <img src={ourGoals2} alt="#" className="our-goals-img img-fluid" />
                                        <div className="our-goals-content">
                                            <h3 className="our-golas-herading">Our Goal</h3>
                                            <p className="text mb-0">Our goal is to exceed the expectations of every customer by
                                                offering outstanding services, high flexibility, and greater value, thus optimizing
                                                system functionality and improving operational efficiency.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div
                        className="our-mission-section"
                        style={{
                            backgroundImage:
                                `url(${vissionImg}), url(${missionBgImg}), linear-gradient(90deg, var(--primery) 50%, var(--secondary) 50%)`,
                        }}
                    >
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6 mb-md-0 mb-4">
                                    <div className="our-mission-card me-md-3 me-0">
                                        <div className="our-mission-card-icon  our-mission-ico">
                                            <img src={visionImg} alt="#" className="img-fluid" />
                                        </div>
                                        <div className="our-mission-card-content">
                                            <h2 className="mission-card-heading text-white">VISION</h2>
                                            <p className="text text-white mb-0">Our Vision is to Strive to be among the World’s leading
                                                IT solution providing Company, delivering innovative, quality products and services,
                                                which bring the ultimate customer delight, creating values for customers,
                                                stakeholders and employees of the Company. To be recognized as trusted and preferred
                                                IT Partners in Customers business growth..
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="our-mission-card ms-md-3 m-0">
                                        <div className="our-mission-card-icon">
                                            <img src={missionImg} alt="#" className="img-fluid" />
                                        </div>
                                        <div className="our-mission-card-content ">
                                            <h2 className="mission-card-heading text-dark">MISSION</h2>
                                            <p className="text text-dark mb-0">Our mission is to deliver innovative solutions to our
                                                customers and
                                                establish long-term relationship with them, partnering them in their growth and
                                                success. This will be achieved by being continuously abreast of latest technology,
                                                innovation and using the same to provide optimal value to customers by a team of
                                                committed, motivated and ideally trained employees.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="team-members-section">
                        <div className="container">
                            <h2 className="heading text-center text30">Meet The Team</h2>
                            <p className="text text-center">The best part about working with Bansal is that no two days are the
                                same and we are all on this unified mission of customer satisfaction. </p>
                            <div className="team-members-slider">
                                <Slider {...teamSliderSettings}>
                                    {teacherData.map((member:any) => (
                                        <div className="item" key={member.id}>
                                            <div className="team-members-card">
                                                <div className="team-members-image">
                                                    <img 
                                                    src={member.image ? `${IMAGE_URL}${member.image}` : '/assets/img/no_image.jpg'} alt="#" className="img-fluid" />
                                                </div>
                                                <div className="team-member-details">
                                                    <h3 className="team-member-name text-center">{member.name}</h3>
                                                    <p className="profession-of-member text text-center">{member.subject}</p>
                                                    <div className="team-member-content">
                                                        <p
                                                            className={`about-pera${expanded[member.id] ? ' active' : ''}`}
                                                            ref={el => { aboutRefs.current[member.id] = el; }}
                                                            style={
                                                                expanded[member.id]
                                                                    ? { maxHeight: 'none' }
                                                                    : { maxHeight: '143px', overflow: 'hidden' }
                                                            }
                                                            dangerouslySetInnerHTML={{ __html: member.description || member.short_description }}
                                                        >
                                                            {/* {member.description || member.short_description} */}
                                                        </p>
                                                        {needsReadMore[member.id] && (
                                                            <div className="read-more-btn">
                                                                <button
                                                                    className="btn service-about-more"
                                                                    type="button"
                                                                    onClick={() => handleReadMore(member.id)}
                                                                >
                                                                    {expanded[member.id] ? 'Read Less' : 'Read More'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <Testimonials testimonials = {testimonialList} /> */}
                {/* <section>
                    <div className="partners-section">
                        <div className="container">
                            <h2 className="heading text-primery w-fit-content mx-auto mb-4">Our Prestigious Clients</h2>
                            <div className="partners-cards">
                                <div className="partner-card">
                                    <img src={partners1} alt="#" className="img-fluid" />
                                </div>
                                <div className="partner-card">
                                    <img src={partners2} alt="#" className="img-fluid" />
                                </div>
                                <div className="partner-card">
                                    <img src={partners3} alt="#" className="img-fluid" />
                                </div>
                                <div className="partner-card">
                                    <img src={partners4} alt="#" className="img-fluid" />
                                </div>
                                <div className="partner-card">
                                    <img src={partners5} alt="#" className="img-fluid" />
                                </div>
                                <div className="partner-card">
                                    <img src={partners6} alt="#" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section> */}
            </div>
        </>
    );
}

export default About;
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth/authStore";
import { postApi } from "../services/services";
import { APIPATH } from "../api/urls";
import { toast } from "react-toastify";
import LoaderWithBackground from "../components/LoaderWithBackground";
import Aos from "aos";

const Privacy = () => {
    const { token, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [privacyData, setPrivacyData] = useState<any>('');
    useEffect(() => {
         Aos.init();
        getCms();
    }, []);
    const getCms = (slug = "privacy-policy") => {
        setLoading(true);
        postApi(APIPATH.cms, { slug }, token, logout)
            .then((resp) => {
                const { success, data, message } = resp;
                if (success) {
                    setPrivacyData(data);
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
    return (
        <>
            <LoaderWithBackground visible={loading} />
            <section>
                <div className="other-pages-details-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-8">
                                <div className="other-pages-content">
                                    <h1 className="heading mb-4">{privacyData?.title}</h1>
                                    <p dangerouslySetInnerHTML={{ __html: privacyData?.description }} />
                                    {/* <h2>From Static Pages to Dynamic Experiences</h2>
                                    <p>Modern web design is no longer just about aesthetics; it’s about creating seamless, intuitive, and engaging experiences for users. This requires a deep understanding of user behavior, accessibility standards, and the latest tools and frameworks. Designers and developers must work hand-in-hand to ensure that websites are not only visually appealing but also functional and responsive across all devices.</p>
                                    <h3>The Role of Technology in Shaping the Web</h3>
                                    <p>Technological advancements have played a pivotal role in shaping the web. From the introduction of CSS for styling to JavaScript frameworks like React and Angular, developers now have powerful tools to create dynamic and interactive web applications. These technologies have enabled faster development cycles and richer user experiences.</p>
                                    <h4>Understanding User-Centered Design</h4>
                                    <p>User-centered design focuses on creating experiences that meet the needs and expectations of users. This involves conducting user research, usability testing, and iterative design processes to ensure that the final product is both functional and enjoyable to use.</p>
                                    <h5>Trends That Are Redefining the Digital Landscape</h5>
                                    <ul>
                                        <li>Responsive Design: Ensuring websites look great on all screen sizes</li>
                                        <li>Accessibility: Making the web inclusive for everyone</li>
                                        <li>Performance Optimization: Faster load times for better user experience</li>
                                        <li>SEO Best Practices: Enhancing visibility on search engines</li>
                                        <li>Security: Protecting user data and maintaining trust</li>
                                    </ul>
                                    <h6>Future Predictions for Web Development</h6>
                                    <p>As we look to the future, technologies like artificial intelligence, augmented reality, and voice interfaces are set to redefine how we interact with the web. Staying ahead of these trends will be crucial for anyone involved in web development and design.</p> */}
                                    {/* <a href="#">Explore more about the future of web design</a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

export default Privacy;
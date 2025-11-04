import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/auth/authStore";
import { postApi } from "../services/services";
import { APIPATH, IMAGE_URL } from "../api/urls";
import LoaderWithBackground from "../components/LoaderWithBackground";
export interface blog {
    id: number;
    title: string;
    description: string;
    slug: string;
    formatted_date: string;
    image: string;
    status?: number;
    deleted_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

const BlogDetails = () => {
    const [loading, setLoading] = useState(false);
    const [blogData, setBlogData] = useState<blog>()
    const { token, logout } = useAuthStore();
    const { id } = useParams()
    const slug = id
    useEffect(() => {
        getBlogData()
    }, [])
    const getBlogData = async () => {
        setLoading(true)
        try {
            const resp = await postApi(APIPATH.blogDetails, { slug }, token, logout);
            console.log(resp, 'blogData')
            const { data } = resp
            setBlogData(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <LoaderWithBackground visible={loading} />
            <section>
                <div className="other-pages-details-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-12">
                                <div className="other-pages-content">
                                    <img
                                        // src="/assets/img/blog-page.png" 
                                        src={`${IMAGE_URL}${blogData?.image}`}
                                        alt={blogData?.title}/>
                                    <h1>{blogData?.title}</h1>
                                    <p dangerouslySetInnerHTML={{__html: blogData?.description || ""}} />
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
                                    <p>As we look to the future, technologies like artificial intelligence, augmented reality, and voice interfaces are set to redefine how we interact with the web. Staying ahead of these trends will be crucial for anyone involved in web development and design.</p>
                                    <a href="#">Explore more about the future of web design</a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section>
                <div className="blog-slider-section">
                    <div className="container">
                        <h2 className="heading mb-4 text-center">Other Blogs &amp; News </h2>
                        <div className="blog-listing-slider owl-carousel">
                            <div className="item">
                                <div className="blog-image-card">
                                    <img src="/assets/img/blog-1.png" alt="#" className="img-fluid" />
                                    <div className="blog-cards">
                                        <div className="blog-heading">
                                            <h3 className="blog-title">Worem ipsum dolor sit amet, consectetur adipiscing elit.
                                            </h3>
                                            <p className="blog-sort-disc text"> Nunc vulputate libero et velit interdum, ac
                                                aliquet
                                                odio mattis. Class
                                                aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
                                                himenaeos. Curabitur tempus urna at turpis condimentum lobortis. Ut commodo
                                                efficitur neque. Ut diam quam, semper iaculis condimentum ac, vestibulum eu
                                                nisl.</p>
                                            <p className="blog-post-date">12-Nav-2025</p>
                                        </div>
                                        <div className="blog-link-action">
                                            <a className="btn blog-arrow-btn" href="blog-details.html"><i className="fa-solid fa-arrow-right" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

        </>
    );
}

export default BlogDetails;
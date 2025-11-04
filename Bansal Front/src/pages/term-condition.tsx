import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth/authStore";
import { postApi } from "../services/services";
import { APIPATH } from "../api/urls";
import { toast } from "react-toastify";
import LoaderWithBackground from "../components/LoaderWithBackground";
import Aos from "aos";

const TermsAndCondition = () => {
    const { token, logout } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [termsData, setTermsData] = useState<any>('');
    useEffect(() => {
         Aos.init();
        getCms();
    }, []);
    const getCms = (slug = "term-conditions") => {
        setLoading(true);
        postApi(APIPATH.cms, { slug }, token, logout)
            .then((resp) => {
                const { success, data, message } = resp;
                if (success) {
                    setTermsData(data);
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
                                    <h1 className="heading mb-4">{termsData?.title}</h1>
                                    <div dangerouslySetInnerHTML={{ __html: termsData?.description }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

export default TermsAndCondition;
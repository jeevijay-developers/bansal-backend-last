import{j as e,r as o,I as x,L as d,u as _,A as C,p as A,a as E,M as q,b as F}from"./index-Bc87CdlA.js";import{S as p}from"./index-fVutJWMB.js";const $=({faqs:n})=>e.jsx(e.Fragment,{children:e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"faq-section",children:e.jsxs("div",{className:"container","data-aos":"zoom-in",children:[e.jsxs("h2",{className:"heading mb-4",children:["Frequently Asked ",e.jsx("span",{children:" Questions"})]}),e.jsx("div",{className:"faq-card",children:e.jsx("div",{className:"accordion accordion-flush",id:"accordionFlushExample",children:n.map((i,l)=>{const t=`flush-collapse-${i.id||l}`,r=`flush-heading-${i.id||l}`;return e.jsxs("div",{className:"accordion-item",children:[e.jsx("h2",{className:"accordion-header",id:r,children:e.jsx("button",{className:`accordion-button ${l!==0?"collapsed":""}`,type:"button","data-bs-toggle":"collapse","data-bs-target":`#${t}`,"aria-expanded":l===0,"aria-controls":t,children:i.title})}),e.jsx("div",{id:t,className:`accordion-collapse collapse ${l===0?"show":""}`,"aria-labelledby":r,"data-bs-parent":"#accordionFlushExample",children:e.jsx("div",{className:"accordion-body",children:e.jsx("div",{dangerouslySetInnerHTML:{__html:(i==null?void 0:i.description)||"N/A"}})})})]},i.id||l)})})})]})})})}),z=({testimonials:n})=>{const i={dots:!1,arrows:!1,infinite:n.length>1,slidesToShow:3.5,slidesToScroll:1,autoplay:!0,autoplaySpeed:1500,adaptiveHeight:!1,responsive:[{breakpoint:1920,settings:{slidesToShow:4}},{breakpoint:1400,settings:{slidesToShow:3}},{breakpoint:1200,settings:{slidesToShow:2}},{breakpoint:576,settings:{slidesToShow:1}}]};return e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"testimonials-section",children:e.jsxs("div",{className:"container",children:[e.jsxs("h2",{className:"heading mb-4",children:["Testimonials From Our ",e.jsx("span",{children:"Students"})]}),e.jsx("div",{className:"testimonials-slider",children:e.jsx(p,{...i,children:Array.isArray(n)&&n.map(l=>e.jsx("div",{className:"item",children:e.jsxs("div",{className:"testimonials-card ",children:[e.jsx("div",{className:"testimonial-quote-icon",children:e.jsx("i",{className:"fa-solid fa-quote-left"})}),e.jsx("p",{className:"testimonial-content",children:l.description}),e.jsx("div",{className:"tester-profile",children:e.jsx("div",{className:"tester-content",children:e.jsx("h3",{children:l.name})})})]})},l.id))})})]})})})},B=()=>e.jsxs("section",{className:"mobile-section py-5 my-5 bg-light",children:[e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row align-items-center justify-content-center",children:[e.jsx("div",{className:"col-lg-6 col-md-6 mb-4 mb-md-0",children:e.jsxs("div",{className:"content-wrapper p-4",children:[e.jsx("h1",{className:"fw-bold text-primary mb-0",children:"Bansal Classes App"}),e.jsx("h2",{className:"text-primary fw-bold coming-soon-text",children:"Available on Play Store!"}),e.jsx("p",{className:"my-4",children:"We're excited to announce that the Bansal Classes App for Coaching will be launching soon! Get ready to access expert guidance for NEET, JEE, and classes 6th to 12th, all in one place."}),e.jsxs("div",{className:"feature-list",children:[e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"check-circle",children:e.jsx("i",{className:"bi bi-check"})}),e.jsxs("div",{className:"feature-content",children:[e.jsx("h5",{children:"Expert Faculty"}),e.jsx("p",{children:"Learn from experienced teachers for NEET, JEE, and school exams"})]})]}),e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"check-circle",children:e.jsx("i",{className:"bi bi-check"})}),e.jsxs("div",{className:"feature-content",children:[e.jsx("h5",{children:"Live & Recorded Classes"}),e.jsx("p",{children:"Attend interactive live sessions or learn at your own pace"})]})]}),e.jsxs("div",{className:"feature-item",children:[e.jsx("div",{className:"check-circle",children:e.jsx("i",{className:"bi bi-check"})}),e.jsxs("div",{className:"feature-content",children:[e.jsx("h5",{children:"Doubt Solving & Test Series"}),e.jsx("p",{children:"Get your doubts cleared and practice with regular tests"})]})]}),e.jsxs("div",{className:"download-options d-flex align-items-start gap-3 mt-3",children:[e.jsx("a",{href:"https://play.google.com/store/apps/details?id=com.bansal_classes",target:"_blank",rel:"noopener noreferrer",children:e.jsx("img",{src:"/assets/img/Store=Google Play, Type=Dark, Language=English@2x.png",alt:"Bansal Classes App Preview",className:"img-fluid app-image",style:{width:"180px"}})}),e.jsx("div",{className:"qr-section",children:e.jsx("div",{className:"qr-code-container",children:e.jsx("img",{src:"/assets/img/bansalappqr.png",alt:"QR Code",className:"img-fluid qr-code"})})})]})]})]})}),e.jsx("div",{className:"col-lg-6 col-md-6 text-center",children:e.jsxs("div",{className:"image-wrapper d-flex",children:[e.jsx("a",{href:"https://play.google.com/store/apps/details?id=com.bansal_classes",target:"_blank",rel:"noopener noreferrer",children:e.jsx("img",{src:"/assets/img/OTPVerificationBansalApp.png",alt:"Bansal Classes App Preview",className:"img-fluid app-image"})}),e.jsx("a",{href:"https://play.google.com/store/apps/details?id=com.bansal_classes",target:"_blank",rel:"noopener noreferrer",children:e.jsx("img",{src:"/assets/img/bansallapp.png",alt:"Bansal Classes App Preview",className:"img-fluid app-image"})})]})})]})}),e.jsx("style",{children:`
      
      .mobile-section {
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.content-wrapper {
  padding: 2rem 1rem;
}

h1.text-primary {
  color: #1a4491 !important;
  font-size: 2.8rem;
  margin-bottom: 0;
}

.coming-soon-text {
  color: #0066ff !important;
  font-size: 2.2rem;
}

.app-image {
  max-height: 550px;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15));
}

.image-wrapper {
  position: relative;
  padding: 20px;
}

/* Feature list styling */
.feature-list {
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  margin-bottom: 1.2rem;
  align-items: flex-start;
}

.check-circle {
  background-color: #e6f0ff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.check-circle i {
  color: #0066ff;
  font-size: 16px;
}

.feature-content {
  flex: 1;
}

.feature-content h5 {
  margin-bottom: 5px;
  color: #333;
  font-weight: 600;
}

.feature-content p {
  margin-bottom: 0;
  color: #666;
  font-size: 0.95rem;
}

/* Download Options Styling */
.download-options {
  margin-top: 1.5rem;
}

/* QR Code Section Styling */
.qr-section {
  flex-shrink: 0;
}

.qr-wrapper {
  background: #ffffff;
  border: 2px solid #e6f0ff;
  border-radius: 12px;
  padding: 0.8rem;
  box-shadow: 0 4px 15px rgba(0, 102, 255, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  width: 140px;
  height: fit-content;
}

.qr-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 102, 255, 0.15);
}

.qr-header h6 {
  color: #1a4491;
  font-size: 0.9rem;
  font-weight: 600;
}

.qr-header p {
  font-size: 0.75rem;
  line-height: 1.2;
}

.qr-code-container {
  display: inline-block;
  background: #ffffff;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.qr-code {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .mobile-section {
    padding: 2rem 1rem;
  }
  
  .app-image {
    max-height: 400px;
  }
  
  h1.text-primary {
    font-size: 2.2rem;
  }
  
  .coming-soon-text {
    font-size: 1.8rem;
  }
}
      `})]}),L={infinite:!1,speed:500,slidesToShow:3,slidesToScroll:1,responsive:[{breakpoint:1920,settings:{slidesToShow:3}},{breakpoint:1200,settings:{slidesToShow:2}},{breakpoint:768,settings:{slidesToShow:1}}]},O=({coursesFilter:n})=>{const i=n.filter(s=>s.courses&&s.courses.length>0),[l,t]=o.useState("");o.useEffect(()=>{i.length>0&&t(i[0].category_name)},[n]);const r=i.find(s=>s.category_name===l);return e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"course-listing-section",children:e.jsxs("div",{className:"container",children:[e.jsxs("h2",{className:"heading mb-4",children:["Explore All Our ",e.jsx("span",{className:"course-heading-span",children:"Courses"})]}),e.jsx("ul",{className:"courses-tabs",children:i.map(s=>e.jsx("li",{className:"nav-item",role:"presentation",children:e.jsx("button",{className:`nav-link ${l===s.category_name?"active":""}`,type:"button",onClick:()=>t(s.category_name),children:s.category_name})},s.id))}),e.jsx("div",{className:"courses-listing","data-aos":"fade-left",children:r&&e.jsx("div",{className:"course-listing-slider",children:e.jsx(p,{...L,children:r.courses.map((s,h)=>e.jsx("div",{className:"item",children:e.jsxs("div",{className:"course-card",children:[e.jsxs("div",{className:"course-card-top",style:{display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{position:"absolute",top:"10px",left:"10px",backgroundColor:"#ff5722",color:"#fff",padding:"5px 10px",fontSize:"0.8rem",fontWeight:"bold",borderRadius:"4px",zIndex:1,whiteSpace:"nowrap"},children:["Batch: ",s.batch_type||"N/A"," | Class: ",s.class_name||"N/A"]}),e.jsx("img",{src:s.image?`${x}${s.image}`:"/assets/img/no_image.jpg",alt:s.course_name,style:{width:"100%",height:"auto",objectFit:"cover",borderTopLeftRadius:"8px",borderTopRightRadius:"8px"}}),e.jsxs("div",{className:"course-top-content",children:[e.jsxs("span",{className:"course-badge",children:[e.jsx("i",{className:"fa-solid fa-video"})," ",s==null?void 0:s.batch_type]}),e.jsx("h3",{className:"course-heading",children:s.course_name}),e.jsx("p",{className:"course-title-heading",children:s==null?void 0:s.title_heading}),e.jsxs("p",{className:"course-price",children:["₹",s.offer_price,s.discount>0&&e.jsxs(e.Fragment,{children:[e.jsxs("span",{className:"mrp-price",children:["₹",s.price]}),s.discount_type==="price"?e.jsxs("span",{className:"discount-price",children:["₹ ",s.discount," OFF"]}):e.jsxs("span",{className:"discount-price",children:[s.discount,"% OFF"]})]})]})]})]}),e.jsx("div",{className:"course-card-bottom",children:e.jsx(d,{to:`/course/${s.slug}`,className:"btn course-action-btn-white",children:"View Details"})})]})},h))})})})]})})})},R={infinite:!1,speed:500,slidesToShow:3,slidesToScroll:1,responsive:[{breakpoint:1920,settings:{slidesToShow:3}},{breakpoint:1200,settings:{slidesToShow:2}},{breakpoint:768,settings:{slidesToShow:1}}]},I=({coursesFilter:n})=>{const i=n.filter(s=>s.test_series&&s.test_series.length>0),[l,t]=o.useState("");o.useEffect(()=>{i.length>0&&t(i[0].category_name)},[n]);const r=i.find(s=>s.category_name===l);return i.length===0?null:e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"course-listing-section bg-white",children:e.jsxs("div",{className:"container",children:[e.jsxs("h2",{className:"heading mb-4",children:["Explore All Our"," ",e.jsx("span",{className:"course-heading-span",children:"Test Series"})]}),e.jsx("ul",{className:"courses-tabs mb-0",children:i.map(s=>e.jsx("li",{className:"nav-item",role:"presentation",children:e.jsx("button",{className:`nav-link ${l===s.category_name?"active":""}`,type:"button",onClick:()=>t(s.category_name),children:s.category_name})},s.id))}),e.jsx("div",{className:"courses-listing","data-aos":"fade-left",children:r&&e.jsx("div",{className:"course-listing-slider",children:e.jsx(p,{...R,children:r.test_series.map((s,h)=>e.jsx("div",{className:"item",children:e.jsxs("div",{className:"course-card",children:[e.jsxs("div",{className:"course-card-top",children:[e.jsx("div",{className:"course-op-icon",children:e.jsx("i",{className:"fa-solid fa-book"})}),e.jsxs("div",{className:"course-top-content",children:[e.jsxs("span",{className:"course-badge",children:[e.jsx("i",{className:"fa-solid fa-video"})," ",s==null?void 0:s.batch_type]}),e.jsx("h3",{className:"course-heading",children:s.name}),e.jsx("p",{children:s.title_heading}),e.jsxs("p",{className:"course-price",children:["₹",s.offer_price,e.jsxs("span",{className:"mrp-price",children:["₹",s.price]}),s.discount_type==="price"?e.jsxs("span",{className:"discount-price",children:["₹",s.discount," OFF"]}):e.jsxs("span",{className:"discount-price",children:[s.discount,"% OFF"]})]})]})]}),e.jsx("div",{className:"course-card-bottom",children:e.jsx(d,{to:`/test-series/${s.slug}`,className:"btn course-action-btn-white",children:"View Details"})})]})},h))})})})]})})})},P="https://bansal.ac.in/assets/Crop-Video-CK6hUvkB.mp4",k={dots:!1,arrows:!0,infinite:!0,speed:500,slidesToShow:1,slidesToScroll:1,autoplay:!0,autoplaySpeed:1500,nextArrow:e.jsx("button",{type:"button",className:"slick-next",style:{background:"none",border:"none",position:"absolute",top:"50%",right:"10px",zIndex:1,fontSize:"24px",color:"#000",transform:"translateY(-50%)",cursor:"pointer"},children:e.jsx("i",{className:"fas fa-chevron-right"})}),prevArrow:e.jsx("button",{type:"button",className:"slick-prev",style:{background:"none",border:"none",position:"absolute",top:"50%",left:"10px",zIndex:1,fontSize:"24px",color:"#000",transform:"translateY(-50%)",cursor:"pointer"},children:e.jsx("i",{className:"fas fa-chevron-left"})})},M=()=>{var f,u,N,b,v,w,y;const n=o.useRef(null),{token:i,logout:l}=_(),[t,r]=o.useState(!1),[s,h]=o.useState("");o.useEffect(()=>{C.init(),S();const a=m.current,c=n.current},[]),o.useEffect(()=>{const a=()=>{const c=document.querySelectorAll(".h-100-equal");let j=0;c.forEach(g=>{g.style.height="auto",j=Math.max(j,g.offsetHeight)}),c.forEach(g=>{g.style.height=`${j}px`})};return setTimeout(a,100),window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[]);const S=()=>{r(!0),A(F.home,{},i,l).then(a=>{const{data:c}=a;h(c)}).catch(a=>console.log(a)).finally(()=>{r(!1)})},m=o.useRef(null),T=()=>{m.current&&(m.current.paused?m.current.play():m.current.pause())};return e.jsxs(e.Fragment,{children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:`
      
   .hero-main-card {
  all: initial !important;
}
.hero-main-card {
        margin: 15px 48px;
        padding: 0px 0px;
      }

      .slick-prev.slick-disabled:before,
      .slick-next.slick-disabled:before,
      .slick-prev:before,
      .slick-next:before {
        color: #2B4392;
      }

      /* Responsive Adjustments */
      @media (max-width: 992px) {
        .hero-main-card {
          margin: 15px 24px;
        }
      }

      @media (max-width: 768px) {
        .hero-main-card {
          margin: 10px 16px;
        }

         .hero-main-card img{
          height:300px
        }
      }

      @media (max-width: 576px) {
         .hero-main-card img{
          height:200px
        }
          .slick-arrow{display:none}
      .slick-prev.slick-disabled:before, .slick-next.slick-disabled:before, .slick-prev:before, .slick-next:before{display:none}
          }
    `}}),e.jsx(E,{visible:t}),e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"hero-section","data-aos":"zoom-in-down",children:e.jsx("div",{className:"container",children:e.jsx("div",{className:"hero-main-card",children:e.jsx("div",{className:"row align-items-center justify-content-between",children:e.jsx("div",{className:"",children:e.jsx(p,{...k,children:(s==null?void 0:s.banners)&&(s==null?void 0:s.banners.filter(a=>a.position==="top").map((a,c)=>e.jsx("div",{className:"item",children:e.jsx("div",{className:"hero-slider-card p-0",children:e.jsx("div",{className:"align-items-end",children:e.jsx("div",{className:"",children:e.jsx("a",{href:a.banner_link||"#",target:"_blank",rel:"noopener noreferrer",children:e.jsx("img",{style:{maxHeight:"500px",width:"100%",objectFit:"fill",borderRadius:"10px"},src:a.banner?`${x}${a.banner}`:"/assets/img/no_image.jpg",alt:a.title,className:"img-fluid"})})})})})},c)))})})})})})})}),e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"ideal-course-section",children:[e.jsxs("h2",{className:"heading mb-4",children:["Explore The Ideal Online ",e.jsx("span",{children:" Course For You!"})]}),e.jsx("div",{className:"row",children:(f=s==null?void 0:s.categories)==null?void 0:f.filter(a=>a.courses.length>0).slice(0,3).map((a,c)=>e.jsx("div",{className:"col-md-4 mb-4 mb-md-0",children:e.jsxs("div",{className:"ideal-course-card","data-aos":"flip-right",children:[e.jsx("h3",{className:"ideal-course-title",children:a.category_name}),e.jsxs("div",{className:"ideal-course-card-footer",children:[e.jsxs(d,{to:"/courses",state:{selectedCategory:a.slug},children:["View ",e.jsx("i",{className:"fa-solid fa-arrow-right"})]}),e.jsx("img",{src:a.image?`${x}${a.image}`:"/assets/img/no_image.jpg",alt:`${a.category_name} course`,className:"ideal-course-img"})]})]})},c))}),e.jsx(d,{style:{marginTop:"20px"},to:"/courses",className:"btn btn-primery mx-auto d-block w-fit-content",children:"View All"})]})})}),e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"learning-material-bg",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"learning-material-section",children:[e.jsxs("h2",{className:"heading mb-4",children:["Boost Your Prep With ",e.jsx("span",{children:" Free Learning Materials"})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-md-4 mb-4 mb-md-0",children:e.jsxs("div",{className:"learning-material-card","data-aos":"flip-up",children:[e.jsx("div",{className:"learning-material-top",children:e.jsx("img",{src:"/assets/img/Frame-23.png",alt:"#",className:"img-fluid"})}),e.jsx("h3",{className:"learning-material-title",children:"Mock Tests - JEE & NEET"})]})}),e.jsx("div",{className:"col-md-4 mb-4 mb-md-0",children:e.jsxs("div",{className:"learning-material-card","data-aos":"flip-up",children:[e.jsx("div",{className:"learning-material-top",children:e.jsx("img",{src:"/assets/img/Frame-23.png",alt:"#",className:"img-fluid"})}),e.jsx("h3",{className:"learning-material-title",children:"NEET Complete Study Guide"})]})}),e.jsx("div",{className:"col-md-4 mb-4 mb-md-0",children:e.jsxs("div",{className:"learning-material-card","data-aos":"flip-up",children:[e.jsx("div",{className:"learning-material-top",children:e.jsx("img",{src:"/assets/img/Frame-23.png",alt:"#",className:"img-fluid"})}),e.jsx("h3",{className:"learning-material-title",children:"JEE Advanced Complete Study Guide"})]})})]})]})})})}),e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"why-choose-section",children:e.jsxs("div",{className:"container",children:[e.jsxs("div",{className:"row align-items-center justify-content-between mb-4",children:[e.jsxs("div",{className:"col-md-7 col-xl-6 mb-4","data-aos":"fade-down-right",children:[e.jsxs("h2",{className:"heading mb-4",children:["Why ",e.jsx("span",{children:" Bansal Classes"})]}),e.jsx("h3",{className:"why-choose-heading",children:"Achieve Your Best with Dedicated Personal Guidance"}),e.jsxs("p",{className:"why-choose-content",children:["At ",e.jsx("span",{children:" Bansal Classes"}),", We Ensure Unmatched Personal Attention Through Our ",e.jsx("span",{children:" Dedicated Educators"})," And Smart Tech-Driven Systems."]}),e.jsxs(d,{to:"/about",className:"btn btn-primery",children:["Read More ",e.jsx("i",{className:"fa-solid fa-arrow-right"})]})]}),e.jsx("div",{className:"col-md-5 col-xl-6 mb-4","data-aos":"fade-down-left",children:e.jsx("img",{src:"/assets/img/why-choose.png",alt:"#",className:"img-fluid"})})]}),e.jsx("div",{className:"why-choose-bottom","data-aos":"fade-up",children:e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-lg-3 col-sm-6 mb-4 mb-lg-0",children:e.jsxs("div",{className:"why-choose-bottom-card",children:[e.jsx("img",{src:"/assets/img/live-stream.png",alt:"#",className:"img-fluid"}),e.jsx("h3",{className:"why-choose-bottom-title",children:"Daily Live"}),e.jsx("p",{className:"why-choose-bottom-pera",children:"Interactive Sessions"})]})}),e.jsx("div",{className:"col-lg-3 col-sm-6 mb-4 mb-lg-0",children:e.jsxs("div",{className:"why-choose-bottom-card",children:[e.jsx("img",{src:"/assets/img/contract.png",alt:"#",className:"img-fluid"}),e.jsx("h3",{className:"why-choose-bottom-title",children:"10 Million +"}),e.jsx("p",{className:"why-choose-bottom-pera",children:"Tests, sample papers & notes"})]})}),e.jsx("div",{className:"col-lg-3 col-sm-6 mb-4 mb-sm-0",children:e.jsxs("div",{className:"why-choose-bottom-card",children:[e.jsx("img",{src:"/assets/img/question.png",alt:"#",className:"img-fluid"}),e.jsx("h3",{className:"why-choose-bottom-title",children:"24 x 7"}),e.jsx("p",{className:"why-choose-bottom-pera",children:"Interactive Sessions"})]})}),e.jsx("div",{className:"col-lg-3 col-sm-6",children:e.jsxs("div",{className:"why-choose-bottom-card",children:[e.jsx("img",{src:"/assets/img/skyscraper.png",alt:"#",className:"img-fluid"}),e.jsx("h3",{className:"why-choose-bottom-title",children:"100+"}),e.jsx("p",{className:"why-choose-bottom-pera",children:"Offline centers"})]})})]})})]})})}),((u=s==null?void 0:s.categories)==null?void 0:u.length)>0&&e.jsx(O,{coursesFilter:(s==null?void 0:s.categories)||[]}),((N=s==null?void 0:s.categories)==null?void 0:N.length)>0&&e.jsx(I,{coursesFilter:(s==null?void 0:s.categories)||[]}),e.jsxs("section",{className:"overflow-hidden course-offer-heading",children:[e.jsx("a",{href:`${q}course/bulls-eye-for-neet`,className:"course-offer-plan d-block text-decoration-none",children:e.jsx("div",{className:"container",children:e.jsxs("h2",{className:"course-offer-heading text-white",children:["Bull's Eye |"," ",e.jsx("span",{className:"fw-bold",style:{color:"var(--yellow)"},children:"Get 50% Off Buy Now"})]})})}),e.jsx("div",{className:"city-center-section",children:e.jsxs("div",{className:"container",children:[e.jsx("h2",{className:"heading text-white text-center mb-4 pb-4",children:"Discover Tech-Driven Education at Bansal Classes Offline Centers"}),e.jsxs("div",{className:"city-center-card","data-aos":"zoom-out",children:[e.jsxs("h3",{className:"heading text-center mb-4",children:["We're Now in Your City - Visit Our ",e.jsx("span",{children:" Nearest Centres!"})]}),e.jsx("div",{className:"row",children:(b=s==null?void 0:s.servicableCities)==null?void 0:b.filter(a=>a.total_centers!==0).slice(0,8).map(a=>e.jsx("div",{className:"col-sm-6 col-lg-4 col-xxl-3 mb-4",children:e.jsx(d,{state:{selectedCity:a.slug},to:`/centers/${a.slug}`,className:"text-decoration-none city-hover-ef",children:e.jsxs("div",{className:"city-card",children:[e.jsx("img",{src:a.image?`${x}${a.image}`:"/assets/img/no_image.jpg",alt:a.title,className:"img-fluid"}),e.jsx("h4",{className:"city-name",children:a.title})]})})},a.id))}),e.jsx(d,{to:"/centers-city",className:"btn btn-primery mx-auto d-block w-fit-content",children:"View All"})]})]})})]}),e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"our-video-section",children:e.jsxs("div",{className:"container",children:[e.jsxs("h2",{className:"heading text-center mb-4",children:["At Bansal Classes, we recognize that every student has a ",e.jsx("span",{children:" unique learning style"})]}),e.jsxs("div",{className:"row align-items-center justify-content-between",children:[e.jsx("div",{className:"col-md-5 mb-4 mb-md-0","data-aos":"flip-right",children:e.jsxs("div",{className:"our-video position-relative",children:[e.jsxs("video",{className:"img-fluid d-block",id:"OurVideo",ref:m,children:[e.jsx("source",{src:P,type:"video/mp4"}),"Your browser does not support the video tag."]}),e.jsxs("button",{type:"button",className:"video-play-button position-absolute",onClick:T,style:{top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:10,background:"none",border:"none",fontSize:"24px",color:"#fff"},children:[e.jsx("i",{className:"fa-solid fa-circle-play"})," Inside View"]})]})}),e.jsxs("div",{className:"col-md-6","data-aos":"flip-left",children:[e.jsx("p",{children:" To effectively cater to this diversity, & our educators employ a variety of innovative and proven teaching methodologies that address the broad spectrum of student needs and academic levels."}),e.jsx("p",{children:"We believe that all students—regardless of their current proficiency—can significantly benefit from structured guidance and refined study techniques. With this in mind, we offer the following well-designed learning programs:"}),e.jsxs("ul",{className:"our-video-list",children:[e.jsx("li",{children:"Classroom Learning Program (CLP):"}),e.jsx("li",{children:"A comprehensive in-person program that provides structured, interactive classroom sessions, personal mentoring, and regular assessments to ensure conceptual clarity and academic excellence."}),e.jsx("li",{children:"Distance Learning Program (DLP):"}),e.jsx("li",{children:"Tailored for students who cannot attend physical classes, this program offers expertly curated study materials, online test series, and remote academic support to ensure consistent progress and preparation."})]}),e.jsx(d,{to:"/contact",className:"btn btn-primery",children:"Contact Now"})]})]})]})})}),((v=s==null?void 0:s.banners)==null?void 0:v.some(a=>a.position==="bottom"))&&e.jsx("section",{className:"overflow-hidden",children:e.jsx("div",{className:"results-section",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"top-results-card",children:[e.jsxs("h2",{className:"heading mb-4",children:["Our Outstanding ",e.jsx("span",{children:"Results"})]}),e.jsx("div",{className:"top-results-img-slider",children:e.jsx(p,{...k,children:(w=s==null?void 0:s.banners)==null?void 0:w.filter(a=>a.position==="bottom").map(a=>e.jsx("div",{className:"item",children:e.jsx("img",{src:`${x}${a.banner}`,style:{height:"300px",width:"100%",objectFit:"cover"},alt:a==null?void 0:a.title,className:"img-fluid"})},a.id))})})]})})})}),e.jsx(z,{testimonials:(s==null?void 0:s.testimonials)||[]}),((y=s==null?void 0:s.faqs)==null?void 0:y.length)>0&&e.jsx($,{faqs:s.faqs}),e.jsx(B,{})]})};export{M as default};

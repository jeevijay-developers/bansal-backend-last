import{r as t,u as _,p as u,j as e,a as A,b as p}from"./index-BcaS9PUs.js";const E=()=>{const[f,i]=t.useState(!1),[g,b]=t.useState([]),[N,v]=t.useState([]),{token:d,logout:m}=_(),h={id:"123",city:"Kota"},[a,j]=t.useState({name:"",email:"",mobile:"",message:"",category_id:"",class_id:"",enquiry_for:""});t.useEffect(()=>{y(),k()},[]);const y=()=>{i(!0),u(p.getCategory,{},d,m).then(({success:s,data:l})=>{s&&b(l)}).catch(console.log).finally(()=>i(!1))},k=()=>{i(!0),u(p.getClassesList,{},d,m).then(({success:s,data:l})=>{s&&v(l)}).catch(console.log).finally(()=>i(!1))},c=s=>{const{name:l,value:n}=s.target,r=l==="mobile"?n.replace(/\D/g,"").slice(0,10):n;j(x=>({...x,[l]:r}))},w=async s=>{s.preventDefault();const{name:l,email:n,mobile:r,message:x,category_id:C,class_id:q,enquiry_for:S}=a;if(!l||!n||!r||!x||!C||!q||!S){alert("Please fill in all required fields.");return}if(!/^\d{10}$/.test(r)){alert("Mobile number must be a valid 10-digit number.");return}try{i(!0);const o=await u(p.saveContactPageRequest,a,d,m);o.success?(alert("Request submitted successfully!"),j({name:"",email:"",mobile:"",message:"",category_id:"",class_id:"",enquiry_for:""})):alert(o.message||"Something went wrong.")}catch(o){console.error("Submit Error:",o),alert("Failed to submit request.")}finally{i(!1)}};return e.jsx(e.Fragment,{children:e.jsxs("section",{children:[e.jsx("style",{children:`
      .contact-page-links-card {
    height: 100%;
    background: var(--border);
    padding: 16px;
    border-radius: 20px;
}

.contactus-form {
    height: 100%;
}

.contact-page-links-card .contact-plc-top {
    background: var(--white);
    border-radius: 10px;
    width: 100%;
    font-size: 18px;
    font-weight: 600;
    padding: 10px 16px;
    color: var(--primery);
    margin-bottom: 10px;
}

.contact-page-links-card .contact-plc-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--dark);
    margin-bottom: 12px;
}

.contact-page-links-card .contact-plc-link {
    display: block;
    margin-bottom: 10px;
    text-decoration: none;
    font-size: 16px;
    font-weight: 400;
    color: var(--blue);
}

.map-view {
    display: flex;
    width: 100%;
    height: fit-content;
    overflow: hidden;
    border-radius: 20px;
    border: 10px solid var(--border);
}
       
      `}),e.jsx(A,{visible:f}),e.jsx("div",{className:"contact-section",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row justify-content-between",children:[e.jsxs("div",{className:"col-md-5 col-xl-6 col-xl-5 mb-4",children:[e.jsxs("h2",{className:"heading mb-4",children:["Experience Personalized Guidance -"," ",e.jsx("span",{children:" Visit Our Centre Today"}),"."]}),e.jsxs("ul",{className:"our-video-list",children:[e.jsx("li",{children:"Take a tour of our centre and experience our interactive classes firsthand."}),e.jsx("li",{children:"Get free one-on-one counselling to help you choose the right course."}),e.jsx("li",{children:"Visit us and unlock exclusive discounts available for a limited time."})]}),e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-xl-6 col-lg-12 col-sm-6 mb-4",children:e.jsxs("div",{className:"contact-page-links-card",children:[e.jsxs("h3",{className:"contact-plc-top",children:[e.jsx("i",{className:"fa-solid fa-envelope"})," Email Us"]}),e.jsx("h5",{className:"contact-plc-title",children:"Contact Email"}),e.jsx("a",{href:"mailto:admin@bansal.ac.in",className:"contact-plc-link",children:"admin@bansal.ac.in"}),e.jsx("a",{href:"mailto:info@bansalclassNamees.in",className:"contact-plc-link",children:"info@bansalclasses.in"}),e.jsx("h5",{className:"contact-plc-title",children:"BFTP (Helpline & Admission) :"}),e.jsx("a",{href:"mailto:bftp@bansal.ac.in",className:"contact-plc-link",children:"bftp@bansal.ac.in"}),e.jsx("a",{href:"mailto:bftp@bansalclasses.in",className:"contact-plc-link",children:"bftp@bansalclasses.in"})]})}),e.jsx("div",{className:"col-xl-6 col-lg-12 col-sm-6 mb-4",children:e.jsxs("div",{className:"contact-page-links-card",children:[e.jsxs("h3",{className:"contact-plc-top",children:[e.jsx("i",{className:"fa-solid fa-phone"})," Call Us"]}),e.jsx("h5",{className:"contact-plc-title",children:"For Admission Enquiry"}),e.jsx("a",{href:"tel:+919773343246",className:"contact-plc-link",children:"+91 9773343246"}),e.jsx("a",{href:"tel:+918003045222",className:"contact-plc-link",children:"+91 8003045222"}),e.jsx("h5",{className:"contact-plc-title",children:"For HR Enquiry :"}),e.jsx("a",{href:"tel:+8375015384",className:"contact-plc-link",children:"+91 8375015384"}),e.jsx("h5",{className:"contact-plc-title",children:"BFTP ( Bansal Faculty Training Program)"}),e.jsx("a",{href:"tel:+918003046222",className:"contact-plc-link",children:"+91 8003046222"})]})}),e.jsx("div",{className:"col-lg-12",children:e.jsxs("div",{className:"contact-page-links-card",children:[e.jsxs("h3",{className:"contact-plc-top",children:[e.jsx("i",{className:"fa-solid fa-location-dot"})," Visit Us"]}),e.jsx("h5",{className:"contact-plc-title",children:"Our Address"}),e.jsx("p",{className:"contact-plc-description",children:"‘Bansal Tower’, A-10, Road No. 1, IPIA, Kota-324005 (Rajasthan), India."})]})})]})]}),e.jsx("div",{className:"col-md-7 col-xl-6 mb-4",children:e.jsxs("div",{className:"contactus-form register-details-form",children:[e.jsx("h3",{className:"contact-form-heading",children:"Connect With Us"}),e.jsxs("form",{onSubmit:w,children:[e.jsx("input",{type:"hidden",name:"center_id",value:h==null?void 0:h.id}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-12 mb-3",children:[e.jsx("label",{className:"form-label",children:"Full Name"}),e.jsxs("div",{className:"input-group",children:[e.jsx("input",{type:"text",name:"name",placeholder:"Full Name",className:"form-control",value:a.name,onChange:c,required:!0}),e.jsx("span",{className:"input-group-text text-dark",children:e.jsx("i",{className:"fa-solid fa-user"})})]})]}),e.jsxs("div",{className:"col-md-12 mb-3",children:[e.jsx("label",{className:"form-label",children:"Email"}),e.jsxs("div",{className:"input-group",children:[e.jsx("input",{type:"email",name:"email",placeholder:"Email Address",className:"form-control",value:a.email,onChange:c,required:!0}),e.jsx("span",{className:"input-group-text text-dark",children:e.jsx("i",{className:"fa-solid fa-envelope"})})]})]}),e.jsxs("div",{className:"col-md-6 mb-3",children:[e.jsx("label",{className:"form-label",children:"Mobile"}),e.jsxs("div",{className:"input-group",children:[e.jsx("input",{type:"text",name:"mobile",placeholder:"Mobile Number",className:"form-control",value:a.mobile,onChange:c,required:!0}),e.jsx("span",{className:"input-group-text text-dark",children:e.jsx("i",{className:"fa-solid fa-phone"})})]})]}),e.jsxs("div",{className:"col-md-6 mb-3",children:[e.jsx("label",{className:"form-label",children:"Enquiry For"}),e.jsx("div",{className:"input-group",children:e.jsxs("select",{name:"enquiry_for",className:"form-select",value:a.enquiry_for,onChange:c,required:!0,children:[e.jsx("option",{value:"",children:"Select Enquiry For"}),e.jsx("option",{value:"Admission",children:"Admission"}),e.jsx("option",{value:"Test Series",children:"Test Series"}),e.jsx("option",{value:"DLP",children:"DLP"}),e.jsx("option",{value:"HR",children:"HR"}),e.jsx("option",{value:"Business Associate",children:"Business Associate"})]})})]}),e.jsxs("div",{className:"col-md-6 mb-3",children:[e.jsx("label",{className:"form-label",children:"Stream"}),e.jsx("div",{className:"input-group",children:e.jsxs("select",{name:"category_id",className:"form-select",value:a.category_id,onChange:c,required:!0,children:[e.jsx("option",{value:"",children:"Select Stream"}),g.map(s=>e.jsx("option",{value:s.id,children:s.category_name},s.id))]})})]}),e.jsxs("div",{className:"col-md-6 mb-3",children:[e.jsx("label",{className:"form-label",children:"Class"}),e.jsx("div",{className:"input-group",children:e.jsxs("select",{name:"class_id",className:"form-select",value:a.class_id,onChange:c,required:!0,children:[e.jsx("option",{value:"",children:"Select Class"}),N.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]})})]}),e.jsxs("div",{className:"col-md-12 mb-3",children:[e.jsx("label",{className:"form-label",children:"Message"}),e.jsxs("div",{className:"input-group",children:[e.jsx("textarea",{name:"message",rows:3,placeholder:"Message",className:"form-control",value:a.message,onChange:c,required:!0}),e.jsx("span",{className:"input-group-text text-dark",children:e.jsx("i",{className:"fa-solid fa-message"})})]})]}),e.jsx("div",{className:"col-md-12 mb-3",children:e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",id:"acceptTerms",required:!0}),e.jsxs("label",{className:"form-check-label",htmlFor:"acceptTerms",children:["I accept the"," ",e.jsx("a",{href:"/terms",target:"_blank",children:"Terms & Conditions"})]})]})}),e.jsx("div",{className:"col-md-12 float-right text-right",style:{textAlign:"right"},children:e.jsx("button",{type:"submit",className:"btn btn-primery",children:"Book Free Consultancy"})})]})]})]})}),e.jsx("div",{className:"col-lg-12 mb-4 order-3",children:e.jsx("div",{className:"map-view",children:e.jsx("div",{style:{width:"100%",height:"350px",overflow:"hidden",borderRadius:"8px"},children:e.jsx("iframe",{src:"https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2027.0542492977295!2d75.85707772046906!3d25.142438537097277!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396f851f48542cfb%3A0x9cc8e67847f4a47e!2sBansal%20Classes%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1750227619851!5m2!1sen!2sin",width:"100%",height:"100%",style:{border:0},allowFullScreen:!0,loading:"lazy",referrerPolicy:"no-referrer-when-downgrade",title:"Bansal Classes Location"})})})})]})})})]})})};export{E as default};

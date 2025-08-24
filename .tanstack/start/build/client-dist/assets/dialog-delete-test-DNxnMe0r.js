import{d as i,r as g,f as x,g as j,j as e,B as r,k as y,t as o}from"./main-Cf9OxwIv.js";import{D,a as f,b as m,c as k,d as C,e as T,f as v,g as P}from"./dialog-CS9lxA6o.js";import{T as _}from"./trash-2-aMbAjlot.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],N=i("circle",b);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",key:"1ykcvy"}],["path",{d:"m15 5 3 3",key:"1w25hb"}]],w=i("pencil-line",B),z=({className:c,testId:n,onDelete:t,size:l="icon-xs",variant:d="ghost"})=>{const[h,a]=g.useState(!1),p=x(j.organizer.test.deleteTest),u=async()=>{try{p({testId:n}),o.success("Test deleted successfully"),t==null||t(),a(!1)}catch(s){o.error(s instanceof Error?s.message:"Failed to delete test")}};return e.jsxs(D,{open:h,onOpenChange:a,children:[e.jsx(f,{asChild:!0,children:e.jsx(r,{size:l,variant:d,className:y(c),rounded:!1,onClick:s=>{s.stopPropagation(),s.preventDefault(),a(!0)},children:e.jsx(_,{})})}),e.jsxs(m,{onClick:s=>{s.stopPropagation(),s.preventDefault()},children:[e.jsxs(k,{children:[e.jsx(C,{children:"Delete Test"}),e.jsx(T,{children:"Are you sure you want to delete this test?"})]}),e.jsxs(v,{children:[e.jsx(P,{asChild:!0,children:e.jsx(r,{variant:"secondary",children:"Back"})}),e.jsx(r,{variant:"destructive",onClick:u,children:"Delete"})]})]})]})};export{N as C,z as D,w as P};

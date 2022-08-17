// Action Types
const PUSH_BREADCRUMB = 'PUSH_BREADCRUMB';
const POP_BREADCRUMB = 'POP_BREADCRUMB';

// ActionCreator
 const pushBreadcrumb = ( text, link ) => {
 return {
  type: PUSH_BREADCRUMB,
  payload: { text, link },
}
};
 const popBreadcrumb = () => { return { type: POP_BREADCRUMB }};

 export default {
  pushBreadcrumb,
  popBreadcrumb
 }
let uid = 0;
function getUid() {
  return `ob_calendar_title_${uid++}`;
}
export const TitleNode = (title: string) => ({
  key: getUid(),
  type: "span",
  props: {
    className: "toastui-calendar-left-content",
    children: title,
  },
});

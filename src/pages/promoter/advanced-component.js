export default function asyncComponent(component) {
  return {
    data() {
      return {
        show: false
      };
    },
    computed: {},
    props: component.props,
    render(h) {
      return h(component, {
        on: this.$listeners,
        attrs: this.$attrs,
        props: this.$props
      });
    }
  };
}

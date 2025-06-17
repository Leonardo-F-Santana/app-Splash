jest.mock('react-native-vector-icons/Ionicons', () => {
  const React = require('react');
  const { View } = require('react-native');

  return (props) => <View testID={`icon-${props.name}`}>{props.children}</View>;
});
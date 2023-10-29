import { Text } from '@chakra-ui/react';
import Base from './Base';
import Form from './Form';

export default function Login() {
  return (
    <Base>
      <Form>
        <Text alignSelf="center" fontSize="lg">Start using Wild Track</Text>
      </Form>
    </Base>
  )
}

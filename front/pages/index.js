import Board from '../components/Board';
import LoginForm from '../components/LoginForm';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

const queryClient = new QueryClient();
function Home() {
  return (
    <>
      <LoginForm />
    </>
  );
}

export default Home;

import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';
import NextError from 'next/error';
import { NextPageWithLayout } from 'pages/_app';
import { GetServerSidePropsContext } from 'next';
import { ssrInit } from 'server/lib/ssr';

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const ssr = await ssrInit(context);
  await ssr.prefetchQuery('post.byId', { id: context.query.id as string });

  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
};

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.useQuery(['post.byId', { id }]);
  console.log(postQuery);

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = postQuery;
  return (
    <>
      <h1>{data.title}</h1>
      <em>Created {data.createdAt.toLocaleDateString()}</em>

      <p>{data.text}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  );
};

export default PostViewPage;

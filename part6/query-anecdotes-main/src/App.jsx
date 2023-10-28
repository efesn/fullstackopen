import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests';
import { useNotification } from './components/Notification';

const App = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
    },
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: (updatedAnecdote) => updateAnecdote(updatedAnecdote),
    onMutate: (newData) => {
      
      queryClient.setQueryData(['anecdotes'], (oldAnecdotes) => {
        return oldAnecdotes.map((anecdote) =>
          anecdote.id === newData.id ? { ...anecdote, votes: newData.votes } : anecdote
        );
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
    },
  });

  const addAnecdote = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    if (content.length < 5) {
      newAnecdoteMutation.mutate({ content, votes: 0 });
      return;
    }
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({ content, votes: 0 });
    dispatch({ type: 'SHOW_NOTIFICATION', message: 'New anecdote created!' });

    setTimeout(() => {
      dispatch({ type: 'HIDE_NOTIFICATION' });
    }, 5000);
  };
  

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    dispatch({ type: 'SHOW_NOTIFICATION', message: 'Anecdote voted!' });

    // Hide the notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'HIDE_NOTIFICATION' });
    }, 5000);
  };
  

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  });
  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>anecdote serivce not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h2>Anecdotes app</h2>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">add</button>
      </form>

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            Votes: {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>Vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;

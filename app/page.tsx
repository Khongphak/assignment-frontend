import { redirect } from 'next/navigation';

export default function Home() {
  console.log('testValue1.1')
  redirect('/staff');
}

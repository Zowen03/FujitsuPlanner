declare module '../../Pages/Home' {
    import { FC } from 'react';
    const Home: FC;
    export default Home;
  }
  
  declare module '../../Pages/calendar' {
    import { FC } from 'react';
    interface LinearTaskCalendarProps {
      assignments?: any[];
      templates?: any[];
      loading?: boolean;
    }
    const LinearTaskCalendar: FC<LinearTaskCalendarProps>;
    export default LinearTaskCalendar;
  }
  
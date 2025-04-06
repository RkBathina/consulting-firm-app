import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderComponent from './common/HeaderComponent';
import WelcomeComponent from './common/WelcomeComponent';
import FooterComponent from './common/FooterComponent';
import BenchProfilesComponent from './benchprofiles/BenchProfilesComponent';
import DailySubmissionsComponent from './dailysubmissions/DailySubmissionsComponent';
import InterviewsComponent from './interviews/InterviewsComponent';
import PlacementsComponent from './placements/PlacementsComponent';

import './static/ConsultingFirmApp.css';

export default function ConsultingFirmApp() {
    return (
        <div className="ConsultingFirmApp">
            <BrowserRouter>
                <HeaderComponent />
                <Routes>
                    <Route path='/' element={<WelcomeComponent />} />
                    <Route path='/home' element={<WelcomeComponent />} />
                    <Route path='/benchprofiles' element={
                        <BenchProfilesComponent />
                    } />
                    <Route path='/dailysubmissions' element={
                        <DailySubmissionsComponent />
                    } />
                    <Route path='/interviews' element={
                        <InterviewsComponent />
                    } />
                    <Route path='/placements' element={
                        <PlacementsComponent />
                    } />
                </Routes>
                { <FooterComponent /> }
            </BrowserRouter>
          
        </div>
    )
}

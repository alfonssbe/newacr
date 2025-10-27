'use client';

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/app/admin/components/ui/heading";
import { useEffect, useState } from "react";
import { MostVisited } from "./components/most-visited-card";
import { LiveVisitor } from "./components/live-visitor-card";
import { Card } from "@/app/admin/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountryVisitor } from "./components/visitor-by-country-card";
import { VisitorDevice } from "./components/visitor-device";
import { getSession } from "@/app/admin/actions";
import { redirect } from "next/navigation";


function DashboardPage () {
  const [mostVisitedPageReport, setMostVisitedPageReport] = useState<{ page: string; views: number }[]>([]);
  const [trafficByCountry, setTrafficByCountry] = useState<{ country: string; users: number }[]>([]);
  const [deviceUsed, setDeviceUsed] = useState<{ device: string; users: number }[]>([]);
  const [totalVisitorPerDay, setTotalVisitorPerDay] = useState<{ year: string, month: string, date: string; users: number }[]>([]);
  const [totalVisitor, setTotalVisitor] = useState<{ year: string, month: string, date: string; users: number }[]>([]);
  const [counterMonth, setCounterMonth] = useState<number>(0);
  const [visitorConstraint, setVisitorConstraint] = useState<string>('Last 7 Days')
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false)



  
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const session = await getSession();
        if(!session.isLoggedIn){
          redirect("/admin")
        }
        session.isAdmin && setIsAdmin(true)
      } catch (error) {
        console.error('Error fetching data:', error);
        document.body.style.overflow = '';
      }
    };

    fetchData();
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => [setMostVisitedPageReport(data.mostvisited || []), setTrafficByCountry(data.trafficbycountry || []), setDeviceUsed(data.deviceused || []), setTotalVisitor(data.totalvisitorperday || []), setLoading(false)])

  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Overview" description="" />
        <Separator />

        {isAdmin &&
          <>
            <Card className="mt-6 p-6 shadow-lg rounded-lg border bg-white">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold">Total Visitors {visitorConstraint}</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => [setVisitorConstraint('Last 7 Days'), setTotalVisitorPerDay(totalVisitor.slice(totalVisitor.length - 7, totalVisitor.length))]} className={`${visitorConstraint === 'Last 7 Days' ? 'bg-primary text-white' : ''}`}>
                    Last 7 Days
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => [setVisitorConstraint('Last 30 Days'), setTotalVisitorPerDay(totalVisitor.slice(totalVisitor.length - 30, totalVisitor.length))]} className={`${visitorConstraint === 'Last 30 Days' ? 'bg-primary text-white' : ''}`}>
                    Last 30 Days
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => [setVisitorConstraint('Last 3 Months'), setTotalVisitorPerDay(totalVisitor.slice(totalVisitor.length - 120, totalVisitor.length)), setCounterMonth(3)]} className={`${visitorConstraint === 'Last 3 Months' ? 'bg-primary text-white' : ''}`}>
                    Last 3 Months
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => [setVisitorConstraint('Last 6 Months'), setTotalVisitorPerDay(totalVisitor.slice(totalVisitor.length - 210, totalVisitor.length)), setCounterMonth(6)]} className={`${visitorConstraint === 'Last 6 Months' ? 'bg-primary text-white' : ''}`}>
                    Last 6 Months
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => [setVisitorConstraint('Last 12 Months'), setTotalVisitorPerDay(totalVisitor.slice(totalVisitor.length - 390, totalVisitor.length)), setCounterMonth(12)]} className={`${visitorConstraint === 'Last 12 Months' ? 'bg-primary text-white' : ''}`}>
                    Last 12 Months
                  </Button>
                </div>
              </div>
              <LiveVisitor LiveVisitor={totalVisitorPerDay.length > 0 ? totalVisitorPerDay : totalVisitor.slice(totalVisitor.length - 7, totalVisitor.length)} counterMonth={counterMonth} loading={loading}/>
            </Card>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <MostVisited pageReports={mostVisitedPageReport} loading={loading}/>
            <CountryVisitor LiveVisitor={trafficByCountry.slice(0,5)} loading={loading}/>
            </div>

            <VisitorDevice LiveVisitor={deviceUsed} loading={loading}/>
          </>
        }
      </div>
    </div>
  );
};

export default DashboardPage;

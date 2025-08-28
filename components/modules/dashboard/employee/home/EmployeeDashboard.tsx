import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EmployeeDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your dashboard. Track your tasks and productivity.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tasks Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">
                            +3 from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">
                            2 due today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Hours Logged
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">38.5</div>
                        <p className="text-xs text-muted-foreground">
                            This week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94%</div>
                        <p className="text-xs text-muted-foreground">
                            Above average
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Today&apos;s Tasks</CardTitle>
                        <CardDescription>
                            Your scheduled tasks for today
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <input type="checkbox" className="rounded" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Complete inventory report</p>
                                    <p className="text-xs text-muted-foreground">Due: 3:00 PM</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <input type="checkbox" className="rounded" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Team standup meeting</p>
                                    <p className="text-xs text-muted-foreground">Due: 10:00 AM</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <input type="checkbox" defaultChecked className="rounded" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium line-through">Update product catalog</p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common daily tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <button className="w-full text-left p-2 hover:bg-muted rounded-md">
                                Log time entry
                            </button>
                            <button className="w-full text-left p-2 hover:bg-muted rounded-md">
                                Submit expense report
                            </button>
                            <button className="w-full text-left p-2 hover:bg-muted rounded-md">
                                Request time off
                            </button>
                            <button className="w-full text-left p-2 hover:bg-muted rounded-md">
                                View payslip
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

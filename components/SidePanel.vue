<script setup>
    import {
        SidebarProvider,
        Sidebar,
        SidebarContent,
        SidebarGroup,
        SidebarGroupContent,
        SidebarGroupLabel,
        SidebarMenu,
        SidebarMenuButton,
        SidebarMenuItem,
        SidebarFooter,
    } from "@/components/ui/sidebar"
    import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger
    } from '@/components/ui/tooltip'
    import { useRouter } from 'vue-router'
    import { Home, Edit2, Search, Bookmark, Bell, Settings } from "lucide-vue-next";

    const router = useRouter()
    
    const items = [
        {
            id: '1',
            label: 'Home',
            icon: Home,
            link: '/',
            tip: 'Home'
        },
        {
            id: '2',
            label: 'Summary',
            icon: Edit2,
            link: '/summary',
            tip: 'Summary'
        },
        {
            id: '3',
            label: 'Search',
            icon: Search,
            link: '/search',
            tip: 'Search'
        },
        {
            id: '4',
            label: 'Read Later',
            icon: Bookmark,
            link: '/readlater',
            tip: 'Read Later'
        },
        {
            id: '5',
            label: 'Alarms',
            icon: Bell,
            link: '/alarm',
            tip: 'Alarms'
        },
    ]
</script>

<template>
    <SidebarProvider :defaultOpen="false">
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem v-for="item in items" class="mt-4 flex items-center justify-center">
                                <TooltipProvider :delayDuration="0">
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <SidebarMenuButton asChild key={{item.id}}>
                                                <a class="cursor-pointer hover:bg-gray-100 transition-all ease-in-out duration-300" @click="router.push(item.link)">
                                                    <component :is="item.icon" :size="64"/>
                                                </a>
                                            </SidebarMenuButton>
                                        </TooltipTrigger>

                                        <TooltipContent side="right">
                                            <p>{{ item.tip }}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem class="mb-2 flex items-center justify-center">
                        <TooltipProvider :delayDuration="0">
                            <Tooltip>
                                <TooltipTrigger>
                                    <SidebarMenuButton asChild key="2">
                                        <a class="cursor-pointer hover:bg-gray-100 transition-all ease-in-out duration-300" @click="router.push('/settings')">
                                            <Settings />
                                            <span>Settings</span>
                                        </a>
                                    </SidebarMenuButton>
                                </TooltipTrigger>

                                <TooltipContent side="right">
                                    <p>Settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    </SidebarProvider>
</template>
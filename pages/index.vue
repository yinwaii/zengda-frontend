<script lang="ts">
export const description = 'An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image. The main content area is divided into two rows. The first row has a grid of cards with statistics. The second row has a grid of cards with a table of recent transactions and a list of recent sales.'
export const iframeHeight = '825px'
export const containerClass = 'w-full h-full'
</script>

<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Activity, ArrowUpRight, CircleUser, CreditCard, DollarSign, Menu, Package2, Search, Users } from 'lucide-vue-next'
import {DropdownMenu} from "~/components/ui/dropdown-menu";
import {Checkbox} from "~/components/ui/checkbox";
import {PaginationList, PaginationNext, PaginationPrev} from "reka-ui";
import {CardFooter} from "~/components/ui/card";
import {Tabs} from "~/components/ui/tabs";
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              $45,231.89
            </div>
            <p class="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Subscriptions
            </CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              +2350
            </div>
            <p class="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Sales
            </CardTitle>
            <CreditCard class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              +12,234
            </div>
            <p class="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Active Now
            </CardTitle>
            <Activity class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              +573
            </div>
            <p class="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card class="xl:col-span-2">
          <CardHeader class="flex flex-row items-center">
            <div class="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Recent transactions from your store.
              </CardDescription>
            </div>
            <Button as-child size="sm" class="ml-auto gap-1">
              <a href="#">
                View All
                <ArrowUpRight class="h-4 w-4" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead class="hidden xl:table-column">
                    Type
                  </TableHead>
                  <TableHead class="hidden xl:table-column">
                    Status
                  </TableHead>
                  <TableHead class="hidden xl:table-column">
                    Date
                  </TableHead>
                  <TableHead class="text-right">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div class="font-medium">
                      Liam Johnson
                    </div>
                    <div class="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    Sale
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    <Badge class="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-23
                  </TableCell>
                  <TableCell class="text-right">
                    $250.00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div class="font-medium">
                      Olivia Smith
                    </div>
                    <div class="hidden text-sm text-muted-foreground md:inline">
                      olivia@example.com
                    </div>
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    Refund
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    <Badge class="text-xs" variant="outline">
                      Declined
                    </Badge>
                  </TableCell>
                  <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-24
                  </TableCell>
                  <TableCell class="text-right">
                    $150.00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div class="font-medium">
                      Noah Williams
                    </div>
                    <div class="hidden text-sm text-muted-foreground md:inline">
                      noah@example.com
                    </div>
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    Subscription
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    <Badge class="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-25
                  </TableCell>
                  <TableCell class="text-right">
                    $350.00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div class="font-medium">
                      Emma Brown
                    </div>
                    <div class="hidden text-sm text-muted-foreground md:inline">
                      emma@example.com
                    </div>
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    Sale
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    <Badge class="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-26
                  </TableCell>
                  <TableCell class="text-right">
                    $450.00
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div class="font-medium">
                      Liam Johnson
                    </div>
                    <div class="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    Sale
                  </TableCell>
                  <TableCell class="hidden xl:table-column">
                    <Badge class="text-xs" variant="outline">
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell class="hidden md:table-cell lg:hidden xl:table-column">
                    2023-06-27
                  </TableCell>
                  <TableCell class="text-right">
                    $550.00
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-8">
            <div class="flex items-center gap-4">
              <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p class="text-sm text-muted-foreground">
                  olivia.martin@email.com
                </p>
              </div>
              <div class="ml-auto font-medium">
                +$1,999.00
              </div>
            </div>
            <div class="flex items-center gap-4">
              <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/02.png" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  Jackson Lee
                </p>
                <p class="text-sm text-muted-foreground">
                  jackson.lee@email.com
                </p>
              </div>
              <div class="ml-auto font-medium">
                +$39.00
              </div>
            </div>
            <div class="flex items-center gap-4">
              <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/03.png" alt="Avatar" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  Isabella Nguyen
                </p>
                <p class="text-sm text-muted-foreground">
                  isabella.nguyen@email.com
                </p>
              </div>
              <div class="ml-auto font-medium">
                +$299.00
              </div>
            </div>
            <div class="flex items-center gap-4">
              <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/04.png" alt="Avatar" />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  William Kim
                </p>
                <p class="text-sm text-muted-foreground">
                  will@email.com
                </p>
              </div>
              <div class="ml-auto font-medium">
                +$99.00
              </div>
            </div>
            <div class="flex items-center gap-4">
              <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/05.png" alt="Avatar" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  Sofia Davis
                </p>
                <p class="text-sm text-muted-foreground">
                  sofia.davis@email.com
                </p>
              </div>
              <div class="ml-auto font-medium">
                +$39.00
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <!--
      <div className="flex items-center gap-4">
        <dashboard-interactive />
      </div>
      -->
      <div class="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card class="sm:col-span-2">
              <CardHeader class="pb-3">
                <CardTitle>Your Orders</CardTitle>
                <CardDescription class="max-w-lg text-balance leading-relaxed">
                  Introducing Our Dynamic Orders Dashboard for Seamless
                  Management and Insightful Analysis.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Create New Order</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader class="pb-2">
                <CardDescription>This Week</CardDescription>
                <CardTitle class="text-4xl">
                  $1329
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-xs text-muted-foreground">
                  +25% from last week
                </div>
              </CardContent>
              <CardFooter>
                <Progress :model-value="25" aria-label="25% increase" />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader class="pb-2">
                <CardDescription>This Month</CardDescription>
                <CardTitle class="text-3xl">
                  $5,329
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-xs text-muted-foreground">
                  +10% from last month
                </div>
              </CardContent>
              <CardFooter>
                <Progress :model-value="12" aria-label="12% increase" />
              </CardFooter>
            </Card>
          </div>
          <Tabs default-value="week">
            <div class="flex items-center">
              <TabsList>
                <TabsTrigger value="week">
                  Week
                </TabsTrigger>
                <TabsTrigger value="month">
                  Month
                </TabsTrigger>
                <TabsTrigger value="year">
                  Year
                </TabsTrigger>
              </TabsList>
              <div class="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="sm" class="h-7 gap-1 rounded-md px-3">
                      <ListFilter class="h-3.5 w-3.5" />
                      <span class="sr-only sm:not-sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div class="items-top flex space-x-2">
                        <Checkbox id="terms1" />
                        <label
                          for="terms2"
                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Fulfilled
                        </label>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div class="items-top flex space-x-2">
                        <Checkbox id="terms1" />
                        <label
                          for="terms2"
                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Declined
                        </label>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div class="items-top flex space-x-2">
                        <Checkbox id="terms1" />
                        <label
                          for="terms2"
                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Refunded
                        </label>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" class="h-7 gap-1 rounded-md px-3">
                  <File class="h-3.5 w-3.5" />
                  <span class="sr-only sm:not-sr-only">Export</span>
                </Button>
              </div>
            </div>
            <TabsContent value="week">
              <Card>
                <CardHeader class="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead class="hidden sm:table-cell">
                          Type
                        </TableHead>
                        <TableHead class="hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead class="hidden md:table-cell">
                          Date
                        </TableHead>
                        <TableHead class="text-right">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow class="bg-accent">
                        <TableCell>
                          <div class="font-medium">
                            Liam Johnson
                          </div>
                          <div class="hidden text-sm text-muted-foreground md:inline">
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          <Badge class="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                          2023-06-23
                        </TableCell>
                        <TableCell class="text-right">
                          $250.00
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div class="font-medium">
                            Olivia Smith
                          </div>
                          <div class="hidden text-sm text-muted-foreground md:inline">
                            olivia@example.com
                          </div>
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          Refund
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          <Badge class="text-xs" variant="outline">
                            Declined
                          </Badge>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                          2023-06-24
                        </TableCell>
                        <TableCell class="text-right">
                          $150.00
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div class="font-medium">
                            Noah Williams
                          </div>
                          <div class="hidden text-sm text-muted-foreground md:inline">
                            noah@example.com
                          </div>
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          Subscription
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          <Badge class="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                          2023-06-25
                        </TableCell>
                        <TableCell class="text-right">
                          $350.00
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div class="font-medium">
                            Emma Brown
                          </div>
                          <div class="hidden text-sm text-muted-foreground md:inline">
                            emma@example.com
                          </div>
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          <Badge class="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                          2023-06-26
                        </TableCell>
                        <TableCell class="text-right">
                          $450.00
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div class="font-medium">
                            Liam Johnson
                          </div>
                          <div class="hidden text-sm text-muted-foreground md:inline">
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          <Badge class="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                          2023-06-23
                        </TableCell>
                        <TableCell class="text-right">
                          $250.00
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div class="font-medium">
                            Liam Johnson
                          </div>
                          <div class="hidden text-sm text-muted-foreground md:inline">
                            liam@example.com
                          </div>
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          <Badge class="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                          2023-06-23
                        </TableCell>
                        <TableCell class="text-right">
                          $250.00
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div class="font-medium">
                            Olivia Smith
                          </div>
                          <div class="hidden text-sm text-muted-foreground md:inline">
                            olivia@example.com
                          </div>
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          Refund
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          <Badge class="text-xs" variant="outline">
                            Declined
                          </Badge>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                          2023-06-24
                        </TableCell>
                        <TableCell class="text-right">
                          $150.00
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div class="font-medium">
                            Emma Brown
                          </div>
                          <div class="hidden text-sm text-muted-foreground md:inline">
                            emma@example.com
                          </div>
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          Sale
                        </TableCell>
                        <TableCell class="hidden sm:table-cell">
                          <Badge class="text-xs" variant="secondary">
                            Fulfilled
                          </Badge>
                        </TableCell>
                        <TableCell class="hidden md:table-cell">
                          2023-06-26
                        </TableCell>
                        <TableCell class="text-right">
                          $450.00
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card class="overflow-hidden">
            <CardHeader class="flex flex-row items-start bg-muted/50">
              <div class="grid gap-0.5">
                <CardTitle class="group flex items-center gap-2 text-lg">
                  Order ID: Oe31b70H
                  <Button
                    size="icon"
                    variant="outline"
                    class="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy class="h-3 w-3" />
                    <span class="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>Date: November 23, 2023</CardDescription>
              </div>
              <div class="ml-auto flex items-center gap-1">
                <Button size="sm" variant="outline" class="h-8 gap-1">
                  <Truck class="h-3.5 w-3.5" />
                  <span class="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Track Order
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button size="icon" variant="outline" class="h-8 w-8">
                      <MoreVertical class="h-3.5 w-3.5" />
                      <span class="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Trash</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent class="p-6 text-sm">
              <div class="grid gap-3">
                <div class="font-semibold">
                  Order Details
                </div>
                <ul class="grid gap-3">
                  <li class="flex items-center justify-between">
                    <span class="text-muted-foreground">
                      Glimmer Lamps x <span>2</span>
                    </span>
                    <span>$250.00</span>
                  </li>
                  <li class="flex items-center justify-between">
                    <span class="text-muted-foreground">
                      Aqua Filters x <span>1</span>
                    </span>
                    <span>$49.00</span>
                  </li>
                </ul>
                <Separator class="my-2" />
                <ul class="grid gap-3">
                  <li class="flex items-center justify-between">
                    <span class="text-muted-foreground">Subtotal</span>
                    <span>$299.00</span>
                  </li>
                  <li class="flex items-center justify-between">
                    <span class="text-muted-foreground">Shipping</span>
                    <span>$5.00</span>
                  </li>
                  <li class="flex items-center justify-between">
                    <span class="text-muted-foreground">Tax</span>
                    <span>$25.00</span>
                  </li>
                  <li class="flex items-center justify-between font-semibold">
                    <span class="text-muted-foreground">Total</span>
                    <span>$329.00</span>
                  </li>
                </ul>
              </div>
              <Separator class="my-4" />
              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-3">
                  <div class="font-semibold">
                    Shipping Information
                  </div>
                  <address class="grid gap-0.5 not-italic text-muted-foreground">
                    <span>Liam Johnson</span>
                    <span>1234 Main St.</span>
                    <span>Anytown, CA 12345</span>
                  </address>
                </div>
                <div class="grid auto-rows-max gap-3">
                  <div class="font-semibold">
                    Billing Information
                  </div>
                  <div class="text-muted-foreground">
                    Same as shipping address
                  </div>
                </div>
              </div>
              <Separator class="my-4" />
              <div class="grid gap-3">
                <div class="font-semibold">
                  Customer Information
                </div>
                <dl class="grid gap-3">
                  <div class="flex items-center justify-between">
                    <dt class="text-muted-foreground">
                      Customer
                    </dt>
                    <dd>Liam Johnson</dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="text-muted-foreground">
                      Email
                    </dt>
                    <dd>
                      <a href="mailto:">liam@acme.com</a>
                    </dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="text-muted-foreground">
                      Phone
                    </dt>
                    <dd>
                      <a href="tel:">+1 234 567 890</a>
                    </dd>
                  </div>
                </dl>
              </div>
              <Separator class="my-4" />
              <div class="grid gap-3">
                <div class="font-semibold">
                  Payment Information
                </div>
                <dl class="grid gap-3">
                  <div class="flex items-center justify-between">
                    <dt class="flex items-center gap-1 text-muted-foreground">
                      <CreditCard class="h-4 w-4" />
                      Visa
                    </dt>
                    <dd>**** **** **** 4532</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter class="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div class="text-xs text-muted-foreground">
                Updated <time dateTime="2023-11-23">November 23, 2023</time>
              </div>
<!--              <Pagination class="ml-auto mr-0 w-auto" :items-per-page="10">-->
<!--                <PaginationList class="gap-1">-->
<!--                  <PaginationPrev variant="outline" class="h-6 w-6" />-->
<!--                  <PaginationNext variant="outline" class="h-6 w-6" />-->
<!--                </PaginationList>-->
<!--              </Pagination>-->
            </CardFooter>
          </Card>
        </div>
    </main>
  </div>
</template>

import { NavigationMenuList } from "@radix-ui/react-navigation-menu";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import logoPlain from "@/assets/logo-plain.svg";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

export function Navbar() {
	return (
		<div className="flex px-8 py-4 items-center justify-between w-full">
			<NavigationMenu viewport={false}>
				<NavigationMenuList className="flex">
					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link to="/">
								<img src={logoPlain} alt="Genu-in" className="size-6" />
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link to="/">Início</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link to="/trainings">Treinamentos</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>

					<NavigationMenuItem>
						<NavigationMenuTrigger>Components</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
								{components.map((component) => (
									<ListItem
										key={component.title}
										title={component.title}
										href={component.href}
									>
										{component.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>List</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="grid w-[300px] gap-4">
								<li>
									<NavigationMenuLink asChild>
										<Link to="#">
											<div className="font-medium">Components</div>
											<div className="text-muted-foreground">
												Browse all components in the library.
											</div>
										</Link>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<Link to="#">
											<div className="font-medium">Documentation</div>
											<div className="text-muted-foreground">
												Learn how to use the library.
											</div>
										</Link>
									</NavigationMenuLink>
									<NavigationMenuLink asChild>
										<Link to="#">
											<div className="font-medium">Blog</div>
											<div className="text-muted-foreground">
												Read our latest blog posts.
											</div>
										</Link>
									</NavigationMenuLink>
								</li>
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
function ListItem({
	title,
	children,
	href,
	...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink asChild>
				<Link to={href}>
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}

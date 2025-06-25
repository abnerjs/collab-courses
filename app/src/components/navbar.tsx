import { NavigationMenuList } from "@radix-ui/react-navigation-menu";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import logoPlain from "@/assets/logo-plain.svg";
import { Link } from "@tanstack/react-router";

export function Navbar() {
	return (
		<div className="flex px-8 py-4 items-center justify-between w-full z-50">
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
						<NavigationMenuLink
							asChild
							className={navigationMenuTriggerStyle()}
						>
							<Link to="/matrix-trainings">Matriz de Treinamentos</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}

// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://gaming.henrymeyer.de",
  integrations: [
    starlight({
      title: "HenryMM Gaming",
      favicon: "/favicon.ico",
      components: {
        Footer: "./src/components/Footer.astro",
        Head: "./src/components/Head.astro",
        PageTitle: "./src/components/PageTitle.astro",
      },
      social: [
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/EHU4YMaHGT",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/henrymmey",
        },
        {
          icon: "link",
          label: "Modrinth",
          href: "https://modrinth.com/user/henrymmey",
        },
        {
          icon: "link",
          label: "Curseforge",
          href: "https://www.curseforge.com/members/henrymmey",
        },
      ],
      sidebar: [
        {
          label: "Projects",
          slug: "projects",
        },
        {
          label: "Modpacks",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "HM Basic Play",
              collapsed: false,
              items: [
                {
                  label: "Overview",
                  slug: "projects/modpacks/hm-basic-play",
                },
                {
                  label: "Installation",
                  slug: "projects/modpacks/hm-basic-play/installation",
                },
                {
                  label: "Included Projects",
                  slug: "projects/modpacks/hm-basic-play/included-projects",
                },
              ],
            },
            {
              label: "JS Combat Pro",
              collapsed: false,
              items: [
                {
                  label: "Overview",
                  slug: "projects/modpacks/js-combat-pro",
                },
                {
                  label: "Installation",
                  slug: "projects/modpacks/js-combat-pro/installation",
                },
                {
                  label: "Included Projects",
                  slug: "projects/modpacks/js-combat-pro/included-projects",
                },
              ],
            },
            {
              label: "HM Life+",
              collapsed: true,
              items: [
                {
                  label: "Overview",
                  slug: "projects/modpacks/hm-lifep",
                },
                {
                  label: "Installation",
                  slug: "projects/modpacks/hm-lifep/installation",
                },
                {
                  label: "Included Projects",
                  slug: "projects/modpacks/hm-lifep/included-projects",
                },
              ],
            },
            {
              label: "JS Performance Core",
              collapsed: true,
              items: [
                {
                  label: "Overview",
                  slug: "projects/modpacks/js-performance-core",
                },
                {
                  label: "Installation",
                  slug: "projects/modpacks/js-performance-core/installation",
                },
                {
                  label: "Included Projects",
                  slug: "projects/modpacks/js-performance-core/included-projects",
                },
              ],
            },
            {
              label: "HMT Pack",
              collapsed: true,
              items: [
                {
                  label: "Overview",
                  slug: "projects/modpacks/hmt-pack",
                },
                {
                  label: "Installation",
                  slug: "projects/modpacks/hmt-pack/installation",
                },
                {
                  label: "Included Projects",
                  slug: "projects/modpacks/hmt-pack/included-projects",
                },
              ],
            },
          ],
        },
        {
          label: "Resource Packs",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "JS Green Ores",
              collapsed: false,
              items: [
                {
                  label: "Overview",
                  slug: "projects/resourcepacks/js-green-ores",
                },
                {
                  label: "Installation",
                  slug: "projects/resourcepacks/js-green-ores/installation",
                },
              ],
            },
            {
              label: "JS Cyan Ores",
              collapsed: true,
              items: [
                {
                  label: "Overview",
                  slug: "projects/resourcepacks/js-cyan-ores",
                },
                {
                  label: "Installation",
                  slug: "projects/resourcepacks/js-cyan-ores/installation",
                },
              ],
            },
            {
              label: "JS Removed Crosshair",
              collapsed: true,
              items: [
                {
                  label: "Overview",
                  slug: "projects/resourcepacks/js-removed-crosshair",
                },
                {
                  label: "Installation",
                  slug: "projects/resourcepacks/js-removed-crosshair/installation",
                },
              ],
            },
          ],
        },
        {
          label: "Mods",
          items: [
            {
              label: "Attribute PVP Helper Reforged",
              collapsed: false,
              items: [
                {
                  label: "Overview",
                  slug: "projects/mods/attribute-pvp-helper-reforged",
                },
              ],
            },
          ],
        },
        {
          label: "Contribute",
          slug: "contribute",
        },
      ],
    }),
  ],
});

import { guardAdminRequest, requireSameOrigin } from "@/lib/auth";
import { jsonError, jsonFromError, jsonOk } from "@/lib/admin/http";
import { deleteSeason, updateSeason } from "@/lib/admin/seasons";
import { seasonPatchSchema } from "@/lib/admin/schemas";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/seasons/[slug]">,
) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  const { slug } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = seasonPatchSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromError(parsed.error);
  }

  try {
    const { season } = await updateSeason(slug, parsed.data);
    return jsonOk({ season });
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/admin/seasons/[slug]">,
) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  const { slug } = await ctx.params;
  try {
    await deleteSeason(slug);
    return jsonOk({});
  } catch (error) {
    return jsonFromError(error);
  }
}
import { guardAdminRequest, requireSameOrigin } from "@/lib/auth";
import { jsonError, jsonFromError, jsonOk } from "@/lib/admin/http";
import { deleteMember, updateMember } from "@/lib/admin/crew";
import { crewPatchSchema } from "@/lib/admin/schemas";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/crew/[slug]">,
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

  const parsed = crewPatchSchema.safeParse(body);
  if (!parsed.success) {
    return jsonFromError(parsed.error);
  }

  try {
    const { member } = await updateMember(slug, parsed.data);
    return jsonOk({ member });
  } catch (error) {
    return jsonFromError(error);
  }
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/admin/crew/[slug]">,
) {
  const guard = await guardAdminRequest(request);
  if (guard.error) return guard.error;

  const csrf = requireSameOrigin(request);
  if (csrf) return csrf;

  const { slug } = await ctx.params;
  try {
    await deleteMember(slug);
    return jsonOk({});
  } catch (error) {
    return jsonFromError(error);
  }
}
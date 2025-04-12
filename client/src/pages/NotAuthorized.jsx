import PageWrapper from "../components/PageWrapper";

export default function NotAuthorized() {
    return (
        <PageWrapper>
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600">⛔ Accès refusé</h1>
                <p className="mt-2 text-gray-700">Tu n’as pas la permission d'accéder à cette page.</p>
            </div>
        </PageWrapper>
    );
  }
  
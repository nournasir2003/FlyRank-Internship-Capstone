export default async function Health() {
  let data = null;
  let error = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
      cache: "no-store",
    });

    data = await res.json();
  } catch (err) {
    console.error(err);
    error = String(err);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Health Check</h1>

      {error && <p className="text-red-600">ERROR: {error}</p>}

      {data && (
        <pre className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

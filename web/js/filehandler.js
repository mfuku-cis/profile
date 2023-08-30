const file2str = async (filepath) => {
	const res = await fetch(filepath)
	return await res.text()
}
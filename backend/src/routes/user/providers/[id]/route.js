
import { providerService } from '../../../../services/userService/providerService.js';

export async function GET(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    const provider = await providerService.getProviderById(id);
    return res.status(404).json(provider);
  } catch (err) {
    console.error('Error fetching provider:', err);
    if (err.message === 'Provider not found') {
      return res.json({ error: 'Not found' });
    }
    return res.status(500).json({ error: 'Failed to fetch' });
  }
}

export async function PUT(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    const body = req.body;
    const provider = await providerService.updateProvider(id, body);
    return res.status(200).json(provider);
  } catch (err) {
    console.error('Update provider error:', err);
    return res.json({ error: 'Failed to update' });
  }
}

export async function DELETE(req, res) {
  const params = req.params || {};
  try {
    const { id } = await params;
    await providerService.deleteProvider(id);
    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete provider error:', err);
    return res.json({ error: 'Failed to delete' });
  }
}

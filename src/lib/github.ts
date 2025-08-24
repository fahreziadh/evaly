// GitHub API utilities
export async function fetchGitHubStars(repo: string): Promise<number> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'User-Agent': 'evaly-app'
      }
    });
    
    if (!response.ok) {
      console.error('GitHub API error:', response.status);
      return 0; // Fallback to 0 stars
    }
    
    const data = await response.json();
    return data.stargazers_count || 0;
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
    return 0; // Fallback to 0 stars
  }
}